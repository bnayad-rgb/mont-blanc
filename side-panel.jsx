// Side panel — Mont Blanc card, stats, habit-loop legend, plan summary

const SidePanel = ({ totalAltitude, plan, weekTotals, mountainStyle, weekStart }) => {
  const pct = Math.min(1, totalAltitude / plan.summitAltitude);
  return (
    <aside className="mb-side">
      {/* Mountain card */}
      <div className="mb-side-card mountain-card">
        <div style={{ padding: "12px 12px 0" }}>
          <div className="smallcaps" style={{ color: "var(--ink-2)" }}>Your climb</div>
          <div className="serif" style={{ fontSize: 22, marginTop: 2, color: "var(--ink)", letterSpacing: "-0.01em" }}>
            Mont Blanc · {plan.summitAltitude}m
          </div>
        </div>
        {(mountainStyle === "illustration" || mountainStyle === "both") && (
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 4px 0" }}>
            <MontBlancSilhouette width={290} height={170} altitude={totalAltitude} />
          </div>
        )}
        {(mountainStyle === "rail" || mountainStyle === "both") && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 12px 6px", gap: 14, alignItems: "flex-end" }}>
            <AltitudeRail altitude={totalAltitude} summit={plan.summitAltitude} height={mountainStyle === "both" ? 120 : 220}/>
            <div style={{ flex: 1 }}>
              <div className="serif" style={{ fontSize: 32, lineHeight: 1, color: "var(--ink)" }}>
                {totalAltitude}<span style={{ fontSize: 16, color: "var(--ink-3)" }}>m</span>
              </div>
              <div className="smallcaps" style={{ color: "var(--ink-3)", marginTop: 4 }}>climbed total</div>
              <div style={{ marginTop: 8, fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5 }}>
                {Math.round(pct * 100)}% of the way to the summit
              </div>
            </div>
          </div>
        )}
        <div className="mb-mountain-cap">
          <div>
            <div className="smallcaps" style={{ color: "var(--ink-3)" }}>Climbed</div>
            <div className="serif" style={{ fontSize: 20, color: "var(--ink)" }}>{totalAltitude}m</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="smallcaps" style={{ color: "var(--ink-3)" }}>Remaining</div>
            <div className="serif" style={{ fontSize: 20, color: "var(--alpen-1)" }}>
              {Math.max(0, plan.summitAltitude - totalAltitude)}m
            </div>
          </div>
        </div>
      </div>

      {/* This week stats */}
      <div className="mb-side-card mb-side-card-pad">
        <div className="smallcaps" style={{ color: "var(--ink-3)", marginBottom: 10 }}>This week</div>
        <div className="mb-stat-grid">
          <div className="mb-stat">
            <div className="mb-stat-n">{weekTotals.done}<span style={{ fontSize: 14, color: "var(--ink-3)" }}>/{weekTotals.planned}</span></div>
            <div className="mb-stat-l">workouts</div>
          </div>
          <div className="mb-stat">
            <div className="mb-stat-n">+{weekTotals.altitude}<span style={{ fontSize: 14, color: "var(--ink-3)" }}>m</span></div>
            <div className="mb-stat-l">altitude</div>
          </div>
          <div className="mb-stat">
            <div className="mb-stat-n">{weekTotals.aerobic}</div>
            <div className="mb-stat-l">aerobic done</div>
          </div>
          <div className="mb-stat">
            <div className="mb-stat-n">{weekTotals.strength}</div>
            <div className="mb-stat-l">strength done</div>
          </div>
        </div>
      </div>

      {/* Habit loop legend */}
      <div className="mb-side-card mb-side-card-pad">
        <div className="smallcaps" style={{ color: "var(--ink-3)", marginBottom: 10 }}>The habit loop</div>
        <div className="mb-loop-legend">
          <LegendStep icon="lightbulb" color="var(--alpen-2)" k="Cue" v="The trigger that starts the habit. Same time, same place." />
          <LegendStep icon="sparkle" color="var(--alpen-1)" k="Craving" v="The motivation — why this matters today." />
          <LegendStep icon="boot" color="var(--glacier-2)" k="Response" v="The actual workout. Make it obvious & easy." />
          <LegendStep icon="target" color="var(--forest-2)" k="Reward" v="Tick the box. Log the song. Climb a little higher." />
        </div>
      </div>
    </aside>
  );
};

const LegendStep = ({ icon, color, k, v }) => (
  <div className="mb-loop-step">
    <div className="mb-loop-step-icon" style={{ background: `${color}20`, color }}>
      <Icon name={icon} size={12} stroke={2}/>
    </div>
    <div>
      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{k}.</span> {v}
    </div>
  </div>
);

window.SidePanel = SidePanel;
