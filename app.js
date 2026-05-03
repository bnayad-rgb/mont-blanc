// App — root state, plan-vs-actual logs, derived stats, persistence

const { useEffect: useEff, useState: useStt, useMemo } = React;

const STORAGE_KEY = "mb_track_it_v1";

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
};
const saveState = (s) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "alpenglow",
  "showHabitLoop": true,
  "density": "cozy",
  "mountainStyle": "illustration",
  "confetti": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const initial = loadState() || { logs: {}, plan: null };
  const [logs, setLogs] = useStt(initial.logs || {});
  const [plan, setPlan] = useStt(initial.plan || window.MB_DEFAULT_PLAN);
  const [weekStart, setWeekStart] = useStt(window.MB.startOfWeekSun(new Date()));
  const [shareOpen, setShareOpen] = useStt(false);
  const [editorOpen, setEditorOpen] = useStt(false);
  const [toast, setToast] = useStt(null);

  useEff(() => { saveState({ logs, plan }); }, [logs, plan]);

  const updateLog = (dateISO, workoutId, log) => {
    setLogs((prev) => {
      const next = { ...prev };
      next[dateISO] = { ...(prev[dateISO] || {}), [workoutId]: log };
      return next;
    });
  };

  // Total altitude — every done workout contributes its meters
  const totalAltitude = useMemo(() => {
    let s = 0;
    Object.values(logs).forEach((day) => {
      Object.entries(day || {}).forEach(([wid, l]) => {
        if (!l?.done) return;
        // find the workout in the template by id
        for (const dow of Object.keys(plan.template)) {
          const w = plan.template[dow].find((x) => x.id === wid);
          if (w) { s += w.meters || 0; break; }
        }
      });
    });
    return s;
  }, [logs, plan]);

  const weekTotals = useMemo(() => {
    let planned = 0, done = 0, altitude = 0, aerobic = 0, strength = 0;
    for (let i = 0; i < 7; i++) {
      const d = window.MB.addDays(weekStart, i);
      const iso = window.MB.fmtISODate(d);
      const ws = plan.template[i] || [];
      const dl = logs[iso] || {};
      planned += ws.length;
      ws.forEach((w) => {
        const l = dl[w.id];
        if (l?.done) {
          done += 1;
          altitude += w.meters || 0;
          if (w.type === "aerobic") aerobic += 1;
          if (w.type === "strength") strength += 1;
        }
      });
    }
    return { planned, done, altitude, aerobic, strength };
  }, [logs, weekStart, plan]);

  const onCelebrate = (workout) => {
    if (!tweaks.confetti) return;
    setToast(`+${workout.meters}m climbed`);
    setTimeout(() => setToast(null), 1800);
  };

  // On mobile, scroll today's column into view on first load
  React.useEffect(() => {
    if (window.innerWidth > 600) return;
    const today = window.MB.fmtISODate(new Date());
    const ws = window.MB.fmtISODate(weekStart);
    const wsEnd = window.MB.fmtISODate(window.MB.addDays(weekStart, 6));
    if (today < ws || today > wsEnd) return;
    requestAnimationFrame(() => {
      const el = document.querySelector(".mb-day.is-today");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }, []); // once

  return (
    <div className={`mb-app density-${tweaks.density} palette-${tweaks.palette}`}>
      <Header
        weekStart={weekStart}
        onWeekChange={setWeekStart}
        plan={plan}
        totalAltitude={totalAltitude}
        onShare={() => setShareOpen(true)}
      />

      <div className="mb-main">
        <main>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div className="serif" style={{ fontSize: 24, letterSpacing: "-0.01em" }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>
                {weekTotals.done} of {weekTotals.planned} done · +{weekTotals.altitude}m this week
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button className="btn btn-sm" onClick={() => setEditorOpen(true)}>
                <Icon name="edit" size={13}/> Edit plan
              </button>
              <button className="btn btn-sm" onClick={() => window.MB.downloadWeeklyICS(plan, weekStart)} title="Download an .ics with all this week's workouts as recurring events">
                <Icon name="calendar" size={13}/> Add week to Calendar
              </button>
              <button className="btn btn-sm" onClick={() => {
                if (confirm("Reset all logs and restore the original plan? Altitude climbed will go back to 0.")) {
                  setLogs({});
                  setPlan(window.MB_DEFAULT_PLAN);
                  setToast("Reset complete");
                  setTimeout(() => setToast(null), 1500);
                }
              }} title="Clear all logs and reset the plan">
                <Icon name="x" size={13}/> Reset
              </button>
              <button className="btn btn-sm btn-accent" onClick={() => setShareOpen(true)}>
                <Icon name="share" size={13}/> Share weekly recap
              </button>
            </div>
          </div>

          <WeekView
            weekStart={weekStart}
            plan={plan}
            logs={logs}
            onUpdateLog={updateLog}
            onCelebrate={onCelebrate}
          />

          <PlanFooter plan={plan} />
        </main>

        <SidePanel
          totalAltitude={totalAltitude}
          plan={plan}
          weekTotals={weekTotals}
          mountainStyle={tweaks.mountainStyle}
          weekStart={weekStart}
        />
      </div>

      {editorOpen && (
        <PlanEditor
          plan={plan}
          onChange={setPlan}
          onClose={() => setEditorOpen(false)}
        />
      )}

      {shareOpen && (
        <ShareImage
          weekStart={weekStart}
          plan={plan}
          logs={logs}
          totalAltitude={totalAltitude}
          onClose={() => setShareOpen(false)}
        />
      )}

      <MBTweaks tweaks={tweaks} setTweak={setTweak} />

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%",
          transform: "translateX(-50%)",
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "10px 18px",
          borderRadius: 999,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 16,
          zIndex: 300,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.3s ease",
        }}>
          {toast}
        </div>
      )}

      <datalist id="mb-song-list">
        {window.MB_SONG_SUGGESTIONS.map((s) => <option key={s} value={s}/>)}
      </datalist>
    </div>
  );
}

const PlanFooter = ({ plan }) => (
  <div style={{ marginTop: 28, padding: 18, background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12 }}>
    <div className="smallcaps" style={{ color: "var(--ink-3)", marginBottom: 8 }}>Pfft. Plan · weekly structure</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
      <div>
        <div className="serif" style={{ fontSize: 16, color: "var(--ink)" }}>3 + 1 aerobic</div>
        <div>Three 40-min aerobic during the week, one longer on the weekend.</div>
      </div>
      <div>
        <div className="serif" style={{ fontSize: 16, color: "var(--ink)" }}>2 strength days</div>
        <div>One upper body, one lower body. Can be broken into chunks.</div>
      </div>
      <div>
        <div className="serif" style={{ fontSize: 16, color: "var(--ink)" }}>3 × 10 min on micro days</div>
        <div>Three 10-minute strength bursts on non-aerobic days.</div>
      </div>
      <div>
        <div className="serif" style={{ fontSize: 16, color: "var(--ink)" }}>Sunday: send Ran</div>
        <div>Download the weekly recap and share with your trainer.</div>
      </div>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Register service worker for PWA / offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
