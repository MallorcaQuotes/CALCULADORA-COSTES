/**
 * Calculates the next valid customer delivery time in Europe/Madrid timezone.
 * Rules:
 * 1. Must be at least `minDelayHours` (default: 12 hours) after lead was created.
 * 2. Must be at or after the approval timestamp.
 * 3. Delivery must occur within the delivery window: 10:00 to 14:00 Europe/Madrid.
 * 4. Aim to deliver within 48 hours of lead creation.
 */
export function calculateNextDeliverySlot(
  leadCreatedAt: Date,
  approvedAt: Date = new Date(),
  minDelayHours = 12,
  windowStartHour = 10,
  windowEndHour = 14,
  timeZone = 'Europe/Madrid'
): Date {
  const minEarliestMs = leadCreatedAt.getTime() + minDelayHours * 60 * 60 * 1000;
  const earliestMs = Math.max(minEarliestMs, approvedAt.getTime());
  const earliestDate = new Date(earliestMs);

  // Helper to extract parts in target timezone
  const getParts = (d: Date) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(d);
    const map: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== 'literal') {
        map[p.type] = parseInt(p.value, 10);
      }
    }
    return {
      year: map.year,
      month: map.month,
      day: map.day,
      hour: map.hour === 24 ? 0 : map.hour,
      minute: map.minute,
      second: map.second,
    };
  };

  // Helper to construct a UTC Date corresponding to a specific local year, month, day, hour, min, sec in timeZone
  const makeDateInTz = (year: number, month: number, day: number, hour: number, minute = 0, second = 0): Date => {
    // Start with approximate UTC date
    const d = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    // Determine offset by checking what parts this produces in target timeZone
    const p = getParts(d);
    const currentLocalMs = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    const targetLocalMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const diff = targetLocalMs - currentLocalMs;
    return new Date(d.getTime() + diff);
  };

  const parts = getParts(earliestDate);

  if (parts.hour < windowStartHour) {
    // Before window today -> schedule for today at windowStartHour
    return makeDateInTz(parts.year, parts.month, parts.day, windowStartHour, 0, 0);
  } else if (parts.hour >= windowStartHour && parts.hour < windowEndHour) {
    // Inside window today -> schedule immediately at earliestDate
    return earliestDate;
  } else {
    // After window today -> schedule for tomorrow at windowStartHour
    // Add 1 day
    const nextDay = new Date(earliestDate.getTime() + 24 * 60 * 60 * 1000);
    const nextParts = getParts(nextDay);
    return makeDateInTz(nextParts.year, nextParts.month, nextParts.day, windowStartHour, 0, 0);
  }
}
