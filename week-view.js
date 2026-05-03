// WeekView — Sun-to-Sat layout, responsive (grid on desktop, vertical list on mobile)

const WeekView = ({ weekStart, plan, logs, onUpdateLog, onCelebrate }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = window.MB.addDays(weekStart, i);
    const iso = window.MB.fmtISODate(d);
    const workouts = plan.template[i] || [];
    return { d, iso, dow: i, workouts };
  });

  // Today's iso
  const todayISO = window.MB.fmtISODate(new Date());

  return (
    <div className="mb-week">
      {days.map((day) => {
        const isToday = day.iso === todayISO;
        const dayLogs = logs[day.iso] || {};
        const allDone = day.workouts.length > 0 && day.workouts.every(w => dayLogs[w.id]?.done);
        const someDone = day.workouts.some(w => dayLogs[w.id]?.done);
        return (
          <div key={day.iso} className={`mb-day ${isToday ? "is-today" : ""} ${allDone ? "is-complete" : ""}`}>
            <div className="mb-day-head">
              <div className="mb-day-head-l">
                <div className="mb-day-name serif">{window.MB.DAY_LABELS_FULL[day.dow]}</div>
                <div className="mb-day-date mono">{window.MB.fmtDate(day.d)}</div>
              </div>
              <div className="mb-day-head-r">
                {isToday && (
                  <div className="mb-today-pill">
                    <span className="dot"/> Today
                  </div>
                )}
                <DayProgressDot
                  total={day.workouts.length}
                  done={day.workouts.filter(w => dayLogs[w.id]?.done).length}
                />
              </div>
            </div>

            <div className="mb-day-workouts">
              {day.workouts.length === 0 ? (
                <div className="mb-rest-card">
                  <Icon name="tent" size={16} color="var(--ink-4)"/>
                  <span>Rest day</span>
                </div>
              ) : (
                day.workouts.map((w) => (
                  <WorkoutCard
                    key={w.id}
                    workout={w}
                    dateISO={day.iso}
                    log={dayLogs[w.id]}
                    onUpdate={(l) => onUpdateLog(day.iso, w.id, l)}
                    onCelebrate={onCelebrate}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DayProgressDot = ({ total, done }) => {
  if (total === 0) return null;
  const pct = done / total;
  const r = 11;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 28, height: 28 }}>
      <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="14" cy="14" r={r} fill="none" stroke="var(--line-strong)" strokeWidth="2"/>
        <circle cx="14" cy="14" r={r} fill="none"
                stroke={pct === 1 ? "var(--glacier-2)" : "var(--alpen-2)"}
                strokeWidth="2.4"
                strokeDasharray={c}
                strokeDashoffset={c * (1 - pct)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}/>
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center",
        fontSize: 10, fontFamily: "var(--mono)", color: "var(--ink-3)",
      }}>
        {done}/{total}
      </div>
    </div>
  );
};

window.WeekView = WeekView;
