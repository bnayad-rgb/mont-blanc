// WorkoutCard — shows planned workout, habit loop (cue → craving → response → reward),
// and an inline log for actual execution. Plan vs actual.

const { useState, useRef, useEffect } = React;

const TYPE_ICON = {
  aerobic: "run",
  strength: "dumbbell",
  micro: "stretch",
  rest: "tent",
};

const fireConfetti = (originEl) => {
  if (!originEl) return;
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const layer = document.getElementById("mb-confetti-layer");
  if (!layer) return;
  const colors = ["#E8804C", "#2E5C7E", "#7AA8C7", "#3A5A3F", "#F2A878", "#FFFFFF"];
  const N = 36;
  for (let i = 0; i < N; i++) {
    const el = document.createElement("div");
    const angle = (Math.PI * 2 * i) / N + Math.random() * 0.4;
    const dist = 80 + Math.random() * 140;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;
    const size = 5 + Math.random() * 7;
    const isStar = Math.random() > 0.6;
    Object.assign(el.style, {
      position: "fixed",
      left: cx + "px",
      top: cy + "px",
      width: size + "px",
      height: size + "px",
      background: colors[i % colors.length],
      borderRadius: isStar ? "1px" : "50%",
      transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
      pointerEvents: "none",
      zIndex: 9999,
      transition: `transform 1100ms cubic-bezier(.2,.6,.2,1), opacity 1100ms ease-out`,
      opacity: "1",
    });
    layer.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random() * 720}deg)`;
      el.style.opacity = "0";
    });
    setTimeout(() => el.remove(), 1200);
  }
  // Pulse a "+Xm" altitude badge
  const badge = document.createElement("div");
  badge.textContent = "+ altitude";
  Object.assign(badge.style, {
    position: "fixed",
    left: cx + "px",
    top: cy + "px",
    transform: "translate(-50%, -50%)",
    fontFamily: "var(--serif)",
    fontSize: "22px",
    color: "#1E4866",
    pointerEvents: "none",
    zIndex: 9999,
    fontStyle: "italic",
    transition: "transform 900ms cubic-bezier(.2,.8,.2,1), opacity 900ms ease-out",
    opacity: "1",
  });
  layer.appendChild(badge);
  requestAnimationFrame(() => {
    badge.style.transform = "translate(-50%, calc(-50% - 60px))";
    badge.style.opacity = "0";
  });
  setTimeout(() => badge.remove(), 950);
};

const WorkoutCard = ({ workout, dateISO, log, onUpdate, dense = false, onCelebrate }) => {
  const meta = window.MB.TYPE_META[workout.type] || window.MB.TYPE_META.aerobic;
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const done = !!log?.done;

  const toggleDone = (e) => {
    e.stopPropagation();
    const next = !done;
    onUpdate({ ...log, done: next, completedAt: next ? new Date().toISOString() : null });
    if (next) {
      fireConfetti(cardRef.current);
      onCelebrate && onCelebrate(workout);
    }
  };

  const updateField = (k, v) => onUpdate({ ...log, [k]: v });

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        padding: dense ? "10px 12px" : "12px 14px",
        background: done ? "linear-gradient(180deg, var(--surface) 0%, rgba(46,92,126,0.04) 100%)" : "var(--surface)",
        borderColor: done ? "rgba(46,92,126,0.35)" : "var(--line)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* type accent stripe */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: meta.color,
        opacity: done ? 0.9 : 0.7,
      }}/>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* Done checkbox */}
        <button
          onClick={toggleDone}
          aria-label={done ? "Mark not done" : "Mark done"}
          style={{
            flexShrink: 0,
            width: 26, height: 26,
            borderRadius: "50%",
            border: `1.8px solid ${done ? "var(--glacier-2)" : "var(--ink-4)"}`,
            background: done ? "var(--glacier-2)" : "transparent",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s ease",
            marginTop: 2,
            padding: 0,
          }}
        >
          {done && <Icon name="check" size={14} color="#fff" stroke={2.5}/>}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "2px 8px", borderRadius: 999,
              background: meta.bg, color: meta.color,
              fontSize: 11, fontWeight: 500, letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              <Icon name={TYPE_ICON[workout.type]} size={12} stroke={1.8}/>
              {meta.label}
            </div>
            <span style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>
              {workout.time} · {workout.durationMin}m
            </span>
            <span style={{ fontSize: 11, color: "var(--ink-4)", fontFamily: "var(--mono)" }}>
              +{workout.meters}m
            </span>
          </div>

          <div style={{
            fontFamily: "var(--serif)",
            fontSize: dense ? 16 : 18,
            marginTop: 4,
            color: done ? "var(--ink-3)" : "var(--ink)",
            textDecoration: done ? "line-through" : "none",
            textDecorationColor: "var(--ink-4)",
            letterSpacing: "-0.01em",
          }}>
            {workout.title}
          </div>

          {/* Habit loop strip — explicit cue/craving/response/reward */}
          <div className="mb-habit-loop-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 6,
            marginTop: 8,
            fontSize: 11,
            lineHeight: 1.3,
          }}>
            {[
              { k: "Cue", v: workout.cue, icon: "lightbulb", color: "var(--alpen-2)" },
              { k: "Craving", v: workout.craving, icon: "sparkle", color: "var(--alpen-1)" },
              { k: "Response", v: workout.response, icon: "boot", color: "var(--glacier-2)" },
              { k: "Reward", v: workout.reward, icon: "target", color: "var(--forest-2)" },
            ].map((step, i) => (
              <div key={i} style={{
                padding: "6px 7px",
                background: "rgba(20,32,43,0.03)",
                borderRadius: 6,
                border: "1px solid rgba(20,32,43,0.06)",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  color: step.color, fontSize: 9.5,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  fontWeight: 600,
                  marginBottom: 2,
                }}>
                  <Icon name={step.icon} size={10} stroke={2}/>
                  {step.k}
                </div>
                <div style={{ color: "var(--ink-2)", fontSize: 11 }}>{step.v}</div>
              </div>
            ))}
          </div>

          {/* Bottom row: actions + log */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            <button
              className="btn btn-sm btn-ghost"
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              style={{ color: "var(--ink-2)" }}
            >
              <Icon name="edit" size={13}/>
              {done ? "Edit log" : "Log details"}
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={(e) => { e.stopPropagation(); window.MB.downloadICS(workout, dateISO); }}
              style={{ color: "var(--ink-2)" }}
            >
              <Icon name="calendar" size={13}/>
              Add to Calendar
            </button>
            {log?.song && (
              <span style={{
                fontSize: 11.5, color: "var(--ink-3)", fontStyle: "italic",
                display: "inline-flex", alignItems: "center", gap: 4,
                marginLeft: "auto",
              }}>
                <Icon name="music" size={12}/> {log.song}
              </span>
            )}
          </div>

          {expanded && (
            <div style={{
              marginTop: 10, padding: "10px 12px",
              background: "var(--paper-2)",
              borderRadius: 8,
              borderLeft: `3px solid ${meta.color}`,
              display: "grid", gap: 8,
            }}>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                Plan vs actual
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Field label="Actual duration (min)">
                  <input
                    type="number"
                    value={log?.actualDuration ?? ""}
                    onChange={(e) => updateField("actualDuration", e.target.value)}
                    placeholder={String(workout.durationMin)}
                    style={inputStyle}
                  />
                </Field>
                <Field label="RPE 1–10">
                  <input
                    type="number" min="1" max="10"
                    value={log?.rpe ?? ""}
                    onChange={(e) => updateField("rpe", e.target.value)}
                    placeholder="—"
                    style={inputStyle}
                  />
                </Field>
              </div>
              <Field label="Song of the day">
                <input
                  type="text"
                  value={log?.song ?? ""}
                  onChange={(e) => updateField("song", e.target.value)}
                  placeholder="e.g. Mountain at My Gates — Foals"
                  style={inputStyle}
                  list="mb-song-list"
                />
              </Field>
              <Field label="How it felt">
                <textarea
                  value={log?.notes ?? ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Body, mind, weather, anything for Ran…"
                  style={{ ...inputStyle, minHeight: 50, resize: "vertical", fontFamily: "var(--sans)" }}
                />
              </Field>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--ink-3)", marginRight: 4 }}>Mood:</span>
                {["💪", "🔥", "🙂", "😐", "🫠", "🥶"].map((m) => (
                  <button
                    key={m}
                    onClick={() => updateField("mood", m)}
                    style={{
                      width: 28, height: 28, fontSize: 16,
                      background: log?.mood === m ? "var(--paper-3)" : "transparent",
                      border: "1px solid " + (log?.mood === m ? "var(--ink-3)" : "var(--line)"),
                      borderRadius: 6, cursor: "pointer",
                    }}
                  >{m}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "7px 10px",
  fontSize: 13,
  fontFamily: "var(--sans)",
  background: "var(--surface)",
  border: "1px solid var(--line-strong)",
  borderRadius: 6,
  color: "var(--ink)",
  outline: "none",
};

const Field = ({ label, children }) => (
  <label style={{ display: "block" }}>
    <div style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3, fontWeight: 600 }}>
      {label}
    </div>
    {children}
  </label>
);

Object.assign(window, { WorkoutCard, fireConfetti });
