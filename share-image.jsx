// ShareImage — generates a downloadable PNG for the trainer (Ran)
// using html-to-image to capture a hidden DOM template.

const ShareImage = ({ weekStart, plan, logs, totalAltitude, onClose }) => {
  const ref = React.useRef(null);
  const [busy, setBusy] = React.useState(false);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = window.MB.addDays(weekStart, i);
    const iso = window.MB.fmtISODate(d);
    const workouts = plan.template[i] || [];
    const dayLogs = logs[iso] || {};
    return { d, iso, dow: i, workouts, dayLogs };
  });

  const totalPlanned = days.reduce((s, d) => s + d.workouts.length, 0);
  const totalDone = days.reduce((s, d) =>
    s + d.workouts.filter(w => d.dayLogs[w.id]?.done).length, 0);
  const altitudeThisWeek = days.reduce((s, d) =>
    s + d.workouts.reduce((ws, w) => ws + (d.dayLogs[w.id]?.done ? w.meters : 0), 0), 0);

  const songs = [];
  days.forEach(d => d.workouts.forEach(w => {
    const l = d.dayLogs[w.id];
    if (l?.song) songs.push(l.song);
  }));

  const downloadPNG = async () => {
    if (!window.htmlToImage) return alert("Image library still loading…");
    setBusy(true);
    try {
      const dataUrl = await window.htmlToImage.toPng(ref.current, {
        pixelRatio: 2, backgroundColor: "#F2EBDB",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `mont-blanc-week-${window.MB.fmtISODate(weekStart)}.png`;
      a.click();
    } catch (e) { console.error(e); alert("Could not export — try screenshot."); }
    setBusy(false);
  };

  return (
    <div className="mb-modal-bg" onClick={onClose}>
      <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mb-modal-head">
          <div className="serif" style={{ fontSize: 22 }}>Weekly summary for Ran</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={downloadPNG} disabled={busy}>
              <Icon name="download" size={14}/> {busy ? "Exporting…" : "Download PNG"}
            </button>
            <button className="btn btn-ghost" onClick={onClose}><Icon name="x" size={16}/></button>
          </div>
        </div>

        <div className="mb-share-scroll">
          <div ref={ref} className="mb-share-card">
            {/* Header band */}
            <div className="mb-share-header">
              <div>
                <div className="smallcaps" style={{ color: "var(--alpen-2)" }}>Mont Blanc · Week recap</div>
                <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, marginTop: 4 }}>
                  Week of {window.MB.fmtDate(weekStart)} – {window.MB.fmtDate(window.MB.addDays(weekStart, 6))}
                </div>
                <div style={{ marginTop: 4, color: "var(--ink-3)", fontSize: 13 }}>
                  Track It · for Ran · {plan.name}
                </div>
              </div>
              <MontBlancSilhouette width={220} height={130} altitude={totalAltitude} />
            </div>

            {/* Stats strip */}
            <div className="mb-share-stats">
              <Stat n={`${totalDone}/${totalPlanned}`} l="workouts done"/>
              <Stat n={`+${altitudeThisWeek}m`} l="altitude this week"/>
              <Stat n={`${totalAltitude}m`} l={`of ${plan.summitAltitude}m`}/>
              <Stat n={`${Math.round(totalAltitude / plan.summitAltitude * 100)}%`} l="to summit"/>
            </div>

            <TopoBand height={28} opacity={0.22}/>

            {/* Day grid */}
            <div className="mb-share-days">
              {days.map((day) => (
                <div key={day.iso} className="mb-share-day">
                  <div className="mb-share-day-head">
                    <div>
                      <div className="serif" style={{ fontSize: 15 }}>{window.MB.DAY_LABELS[day.dow]}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{window.MB.fmtDate(day.d)}</div>
                    </div>
                  </div>
                  <div className="mb-share-day-body">
                    {day.workouts.length === 0 && (
                      <div style={{ fontSize: 11, color: "var(--ink-4)", fontStyle: "italic" }}>Rest</div>
                    )}
                    {day.workouts.map((w) => {
                      const l = day.dayLogs[w.id];
                      const meta = window.MB.TYPE_META[w.type];
                      return (
                        <div key={w.id} style={{
                          display: "flex", alignItems: "flex-start", gap: 5,
                          fontSize: 11, marginBottom: 3,
                          opacity: l?.done ? 1 : 0.55,
                        }}>
                          <div style={{
                            width: 12, height: 12, marginTop: 2,
                            borderRadius: "50%",
                            background: l?.done ? meta.color : "transparent",
                            border: `1.5px solid ${meta.color}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            {l?.done && <Icon name="check" size={8} color="#fff" stroke={3}/>}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: "var(--ink-2)", textDecoration: l?.done ? "none" : "line-through" }}>
                              {w.title}
                            </div>
                            <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-3)" }}>
                              {w.durationMin}m{l?.actualDuration ? ` · actual ${l.actualDuration}m` : ""}
                              {l?.rpe ? ` · RPE ${l.rpe}` : ""}
                              {l?.mood ? ` · ${l.mood}` : ""}
                            </div>
                            {l?.song && (
                              <div style={{ fontSize: 9.5, color: "var(--ink-3)", fontStyle: "italic" }}>
                                ♪ {l.song}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {songs.length > 0 && (
              <div className="mb-share-songs">
                <div className="smallcaps" style={{ color: "var(--ink-3)", marginBottom: 6 }}>Soundtrack</div>
                <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6 }}>
                  {songs.map((s, i) => <span key={i}>♪ {s}{i < songs.length - 1 ? "  ·  " : ""}</span>)}
                </div>
              </div>
            )}

            <div className="mb-share-foot">
              <div className="serif" style={{ fontSize: 13, color: "var(--ink-3)", fontStyle: "italic" }}>
                "Habits are the compound interest of self-improvement."
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>
                Mont Blanc · Track It
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ n, l }) => (
  <div>
    <div className="serif" style={{ fontSize: 22, color: "var(--ink)" }}>{n}</div>
    <div className="smallcaps" style={{ color: "var(--ink-3)", marginTop: 1 }}>{l}</div>
  </div>
);

window.ShareImage = ShareImage;
