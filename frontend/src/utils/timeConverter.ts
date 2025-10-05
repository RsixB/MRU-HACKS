type MaybeDate =
  | Date
  | string
  | number
  | { seconds?: number; nanoseconds?: number }
  | { toDate?: () => Date }
  | null
  | undefined;

export function formatTime(input?: MaybeDate): string {
  if (!input && input !== 0) return "";

  // normalize to Date
  let date: Date | null = null;

  // Already a Date
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "number") {
    // milliseconds since epoch
    date = new Date(input);
  } else if (typeof input === "string") {
    // ISO string or similar
    date = new Date(input);
  } else if (typeof input === "object") {
    const anyInput = input as any;
    // Firestore Timestamp (has toDate)
    if (typeof anyInput.toDate === "function") {
      try {
        date = anyInput.toDate();
      } catch (e) {
        date = null;
      }
    } else if (typeof anyInput.seconds === "number") {
      // { seconds, nanoseconds } shape
      const ms = anyInput.seconds * 1000 + (anyInput.nanoseconds ? Math.round(anyInput.nanoseconds / 1e6) : 0);
      date = new Date(ms);
    } else {
      // give one last try
      try {
        date = new Date(JSON.stringify(anyInput));
      } catch {
        date = null;
      }
    }
  }

  if (!date || isNaN(date.getTime())) return "";

  // Try to use locale formatting (may not exist in some RN runtimes)
  try {
    if (typeof date.toLocaleTimeString === "function") {
      // Try with options first; if runtime doesn't accept options it will throw, so we catch below.
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
  } catch {
    // fall through to manual formatting
  }

  // Fallback: manual "h:mm AM/PM"
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minuteStr} ${ampm}`;
}
