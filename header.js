// Header — title, week navigation, day countdown, summit progress

const Header = ({ weekStart, onWeekChange, plan, totalAltitude, onShare }) => {
  const trip = window.MB.daysUntil(plan.tripDate);
  const pct = Math.min(1, totalAltitude / plan.summitAltitude);

  const goWeek = (delta) => onWeekChange(window.MB.addDays(weekStart, delta * 7));
  const goToday = () => onWeekChange(window.MB.startOfWeekSun(new Date()));

  return (
    <header className="mb-header topo-bg">
      <div className="mb-header-inner">
        <div className="mb-header-l">
          <div className="mb-logo">
            <Icon name="mountain" size={26} color="var(--glacier-1)" stroke={1.6}/>
            <div>
              <div className="serif" style={{ fontSize: 22, lineHeight: 1, letterSpacing: "-0.01em" }}>Mont Blanc</div>
              <div className="smallcaps" style={{ color: "var(--ink-3)", marginTop: 2 }}>Track It · for Ran</div>
            </div>
          </div>

          <div className="mb-week-nav">
            <button className="btn btn-sm btn-ghost" onClick={() => goWeek(-1)} aria-label="Previous week"><Icon name="chevron-left" size={16}/></button>
            <button className="btn btn-sm" onClick={goToday}>Today</button>
            <button className="btn btn-sm btn-ghost" onClick={() => goWeek(1)} aria-label="Next week"><Icon name="chevron-right" size={16}/></button>
            <div className="mb-week-label">
              <span className="serif" style={{ fontSize: 16 }}>Week of {window.MB.fmtDate(weekStart)}</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}> – {window.MB.fmtDate(window.MB.addDays(weekStart, 6))}</span>
            </div>
          </div>
        </div>

        <div className="mb-header-r">
          <div className="mb-countdown">
            <div className="smallcaps" style={{ color: "var(--alpen-2)" }}>Trip in</div>
            <div className="serif" style={{ fontSize: 26, lineHeight: 1 }}>{trip > 0 ? trip : 0}<span style={{ fontSize: 14, color: "var(--ink-3)", marginLeft: 4 }}>days</span></div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{plan.tripDate}</div>
          </div>
          <button className="btn btn-accent" onClick={onShare}>
            <Icon name="send" size={14}/> Share with Ran
          </button>
        </div>
      </div>

      {/* Summit progress band */}
      <div className="mb-summit-band">
        <div className="mb-summit-track">
          <div className="mb-summit-fill" style={{ width: `${pct * 100}%` }}/>
          <div className="mb-summit-marker" style={{ left: `${pct * 100}%` }}>
            <Icon name="boot" size={14} color="var(--ink)" stroke={2}/>
          </div>
          {[0.25, 0.5, 0.75].map((p) => (
            <div key={p} className="mb-summit-tick" style={{ left: `${p * 100}%` }}/>
          ))}
        </div>
        <div className="mb-summit-meta">
          <span className="mono">{totalAltitude}m</span>
          <span style={{ color: "var(--ink-3)" }}> / {plan.summitAltitude}m</span>
          <span className="serif" style={{ fontStyle: "italic", marginLeft: 8, color: "var(--alpen-1)" }}>
            {pct < 1 ? `${plan.summitAltitude - totalAltitude}m to summit` : "Summit reached!"}
          </span>
        </div>
      </div>
    </header>
  );
};

window.Header = Header;
