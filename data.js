// Default training plan, derived from the user's brief.
// "Pfft. Training Plan" — Mont Blanc prep, trip Sept 1 2026.

window.MB_DEFAULT_PLAN = {
  name: "Mont Blanc Prep",
  trainer: "Ran",
  tripDate: "2026-09-01",
  startAltitude: 0,
  summitAltitude: 4808, // Mont Blanc summit, meters
  // Each workout has a "habit loop": cue, craving, response, reward.
  // Plan is templated by weekday (0=Sun ... 6=Sat).
  template: {
    0: [ // Sunday — long aerobic
      {
        id: "sun-aero",
        type: "aerobic",
        title: "Long aerobic",
        durationMin: 60,
        time: "08:00",
        meters: 600,
        cue: "Sunday morning — gear by the door",
        craving: "Open weekend air, no rush",
        response: "60 min easy zone-2",
        reward: "Coffee + log entry + song",
        notes: "Gradually increase volume each week.",
      },
    ],
    1: [ // Monday — strength upper + 3x10min
      {
        id: "mon-str-upper",
        type: "strength",
        title: "Upper body strength",
        durationMin: 30,
        time: "07:00",
        meters: 200,
        cue: "Right after coffee",
        craving: "Strong shoulders for the pack",
        response: "Push / pull / core circuit",
        reward: "Tick + protein shake",
      },
      {
        id: "mon-micro-1",
        type: "micro",
        title: "10-min strength burst",
        durationMin: 10,
        time: "12:30",
        meters: 60,
        cue: "Lunch break alarm",
        craving: "Reset before afternoon",
        response: "Squats, planks, lunges",
        reward: "Tick",
      },
      {
        id: "mon-micro-2",
        type: "micro",
        title: "10-min strength burst",
        durationMin: 10,
        time: "17:30",
        meters: 60,
        cue: "End of workday",
        craving: "Shake off the chair",
        response: "Glutes, calves, core",
        reward: "Tick",
      },
    ],
    2: [ // Tuesday — aerobic
      {
        id: "tue-aero",
        type: "aerobic",
        title: "Aerobic — same time",
        durationMin: 40,
        time: "07:00",
        meters: 400,
        cue: "Same time, same day",
        craving: "Wake up the legs",
        response: "40 min steady, zone-2",
        reward: "Tick + song of the day",
      },
    ],
    3: [ // Wednesday — strength lower + 3x10min
      {
        id: "wed-str-lower",
        type: "strength",
        title: "Lower body strength",
        durationMin: 30,
        time: "07:00",
        meters: 250,
        cue: "Right after coffee",
        craving: "Legs that climb",
        response: "Squats / step-ups / hinges",
        reward: "Tick + protein shake",
      },
      {
        id: "wed-micro-1",
        type: "micro",
        title: "10-min strength burst",
        durationMin: 10,
        time: "12:30",
        meters: 60,
        cue: "Lunch break alarm",
        craving: "Reset before afternoon",
        response: "Calves + balance",
        reward: "Tick",
      },
      {
        id: "wed-micro-2",
        type: "micro",
        title: "10-min strength burst",
        durationMin: 10,
        time: "17:30",
        meters: 60,
        cue: "End of workday",
        craving: "Shake off the chair",
        response: "Hip stability + core",
        reward: "Tick",
      },
    ],
    4: [ // Thursday — aerobic
      {
        id: "thu-aero",
        type: "aerobic",
        title: "Aerobic — same time",
        durationMin: 40,
        time: "07:00",
        meters: 400,
        cue: "Same time, same day",
        craving: "Wake up the legs",
        response: "40 min steady, zone-2",
        reward: "Tick + song of the day",
      },
    ],
    5: [ // Friday — micro day (rest from main lifts)
      {
        id: "fri-micro-1",
        type: "micro",
        title: "10-min mobility",
        durationMin: 10,
        time: "08:00",
        meters: 30,
        cue: "Morning",
        craving: "Open hips before the weekend",
        response: "Mobility flow",
        reward: "Tick",
      },
      {
        id: "fri-micro-2",
        type: "micro",
        title: "10-min strength burst",
        durationMin: 10,
        time: "12:30",
        meters: 60,
        cue: "Lunch break alarm",
        craving: "Reset",
        response: "Core + push",
        reward: "Tick",
      },
      {
        id: "fri-micro-3",
        type: "micro",
        title: "10-min strength burst",
        durationMin: 10,
        time: "17:30",
        meters: 60,
        cue: "End of workday",
        craving: "Shake off the chair",
        response: "Pull + balance",
        reward: "Tick",
      },
    ],
    6: [ // Saturday — aerobic
      {
        id: "sat-aero",
        type: "aerobic",
        title: "Aerobic — same time",
        durationMin: 40,
        time: "08:00",
        meters: 400,
        cue: "Saturday morning",
        craving: "Trail or path",
        response: "40 min steady",
        reward: "Tick + song of the day",
      },
    ],
  },
};

// Sample songs the user might log
window.MB_SONG_SUGGESTIONS = [
  "Mountain at My Gates — Foals",
  "Holocene — Bon Iver",
  "Run Boy Run — Woodkid",
  "Wake Up — Arcade Fire",
  "Heroes — David Bowie",
  "The Wolves — Ben Howard",
  "Ascend — Hammock",
];

// Helpers
window.MB = window.MB || {};

window.MB.startOfWeekSun = function (d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0=Sun
  x.setDate(x.getDate() - day);
  return x;
};

window.MB.addDays = function (d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

window.MB.fmtDate = function (d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

window.MB.fmtDateLong = function (d) {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
};

window.MB.fmtISODate = function (d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

window.MB.weekKey = function (d) {
  return window.MB.fmtISODate(window.MB.startOfWeekSun(d));
};

window.MB.daysUntil = function (iso) {
  const target = new Date(iso + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target - now) / (1000 * 60 * 60 * 24));
};

window.MB.DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
window.MB.DAY_LABELS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ICS .ics generator for Google Calendar
window.MB.makeICS = function (workout, dateISO) {
  const dt = new Date(`${dateISO}T${workout.time || "08:00"}:00`);
  const end = new Date(dt.getTime() + (workout.durationMin || 40) * 60000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const uid = `${workout.id}-${dateISO}@montblanc.trackit`;
  const desc = [
    `Cue: ${workout.cue || ""}`,
    `Craving: ${workout.craving || ""}`,
    `Response: ${workout.response || ""}`,
    `Reward: ${workout.reward || ""}`,
  ].join("\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mont Blanc Track It//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(dt)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${workout.title} — ${workout.type}`,
    `DESCRIPTION:${desc}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

// Bulk weekly ICS — every workout in the week as a recurring weekly event
window.MB.makeWeeklyICS = function (plan, weekStart) {
  const events = [];
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  for (let dow = 0; dow < 7; dow++) {
    const dayDate = window.MB.addDays(weekStart, dow);
    const dateISO = window.MB.fmtISODate(dayDate);
    (plan.template[dow] || []).forEach((w, i) => {
      const dt = new Date(`${dateISO}T${w.time || "08:00"}:00`);
      const end = new Date(dt.getTime() + (w.durationMin || 40) * 60000);
      const desc = [
        `Cue: ${w.cue || ""}`,
        `Craving: ${w.craving || ""}`,
        `Response: ${w.response || ""}`,
        `Reward: ${w.reward || ""}`,
      ].join("\\n");
      events.push([
        "BEGIN:VEVENT",
        `UID:${w.id}-${dateISO}-${i}@montblanc.trackit`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(dt)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:${w.title} — ${w.type}`,
        `DESCRIPTION:${desc}`,
        // Recur weekly until trip date
        `RRULE:FREQ=WEEKLY;UNTIL=${(plan.tripDate || "2026-09-01").replace(/-/g, "")}T000000Z`,
        "END:VEVENT",
      ].join("\r\n"));
    });
  }
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mont Blanc Track It//EN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
};

window.MB.downloadWeeklyICS = function (plan, weekStart) {
  const ics = window.MB.makeWeeklyICS(plan, weekStart);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mont-blanc-week-${window.MB.fmtISODate(weekStart)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

window.MB.downloadICS = function (workout, dateISO) {
  const ics = window.MB.makeICS(workout, dateISO);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${workout.id}-${dateISO}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

// Workout type meta — color, icon
window.MB.TYPE_META = {
  aerobic: { label: "Aerobic", color: "var(--glacier-2)", bg: "rgba(46, 92, 126, 0.10)" },
  strength: { label: "Strength", color: "var(--alpen-1)", bg: "rgba(196, 90, 44, 0.10)" },
  micro: { label: "Micro", color: "var(--forest-2)", bg: "rgba(58, 90, 63, 0.10)" },
  rest: { label: "Rest", color: "var(--ink-3)", bg: "rgba(20, 32, 43, 0.06)" },
};
