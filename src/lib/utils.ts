export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(d: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  const date = new Date(d.length === 10 ? d + "T00:00:00" : d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-IN", opts);
}

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${String(m || 0).padStart(2, "0")} ${ampm}`;
}

/** Returns { open, label } for the current day given opening hours. */
export function openStatus(hours: { day: string; open: string; close: string; closed: boolean }[], now = new Date()) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = hours.find((h) => h.day === days[now.getDay()]);
  const mins = now.getHours() * 60 + now.getMinutes();
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  if (today && !today.closed) {
    if (mins >= toMin(today.open) && mins < toMin(today.close)) return { open: true, label: `Open now · until ${formatTime(today.close)}` };
    if (mins < toMin(today.open)) return { open: false, label: `Opens today ${formatTime(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = hours.find((h) => h.day === days[(now.getDay() + i) % 7]);
    if (d && !d.closed) return { open: false, label: `Closed · opens ${i === 1 ? "tomorrow" : d.day.slice(0, 3)} ${formatTime(d.open)}` };
  }
  return { open: false, label: "Closed" };
}
