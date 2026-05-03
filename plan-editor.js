// PlanEditor — add, edit, delete, reorder, move workouts between days.
// Drag a card to a new day; click a card to edit fields; click + to add.

const NEW_TEMPLATE = () => ({
  id: "w-" + Math.random().toString(36).slice(2, 9),
  type: "aerobic",
  title: "New workout",
  durationMin: 40,
  time: "07:00",
  meters: 300,
  cue: "Same time, same day",
  craving: "Build the climb",
  response: "Steady effort",
  reward: "Tick + log it",
  notes: "",
});

const TYPE_PRESETS = {
  aerobic: { meters: 400, durationMin: 40 },
  strength: { meters: 250, durationMin: 30 },
  micro: { meters: 60, durationMin: 10 },
  rest: { meters: 0, durationMin: 0 },
};

function PlanEditor({ plan, onChange, onClose }) {
  const [editing, setEditing] = React.useState(null); // { dow, idx }
  const [dragging, setDragging] = React.useState(null); // { dow, idx }
  const [dragOver, setDragOver] = React.useState(null); // dow

  const updateTemplate = (next) => onChange({ ...plan, template: next });

  const updateWorkout = (dow, idx, patch) => {
    const next = JSON.parse(JSON.stringify(plan.template));
    next[dow][idx] = { ...next[dow][idx], ...patch };
    updateTemplate(next);
  };
  const addWorkout = (dow) => {
    const next = JSON.parse(JSON.stringify(plan.template));
    next[dow] = next[dow] || [];
    next[dow].push(NEW_TEMPLATE());
    updateTemplate(next);
    setEditing({ dow, idx: next[dow].length - 1 });
  };
  const deleteWorkout = (dow, idx) => {
    const next = JSON.parse(JSON.stringify(plan.template));
    next[dow].splice(idx, 1);
    updateTemplate(next);
    if (editing?.dow === dow && editing?.idx === idx) setEditing(null);
  };
  const moveTo = (fromDow, fromIdx, toDow, toIdx = null) => {
    if (fromDow === toDow && fromIdx === toIdx) return;
    const next = JSON.parse(JSON.stringify(plan.template));
    next[fromDow] = next[fromDow] || [];
    next[toDow] = next[toDow] || [];
    const [item] = next[fromDow].splice(fromIdx, 1);
    if (toIdx === null || toIdx > next[toDow].length) next[toDow].push(item);
    else next[toDow].splice(toIdx, 0, item);
    updateTemplate(next);
  };

  const cur = editing ? plan.template[editing.dow]?.[editing.idx] : null;

  return (
    <div className="mb-modal-bg" onClick={onClose}>
      <div className="mb-modal" style={{ maxWidth: 1100, height: "92vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-modal-head">
          <div>
            <div className="serif" style={{ fontSize: 22 }}>Edit weekly plan</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
              Drag cards to move between days · click any card to edit · changes apply to every week
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>

        <div style={{ flex: 1, overflow: "hidden", display: "grid", gridTemplateColumns: editing ? "1fr 360px" : "1fr", gap: 0 }}>
          {/* Day grid */}
          <div className="mb-pe-grid">
            {[0,1,2,3,4,5,6].map((dow) => {
              const items = plan.template[dow] || [];
              const isOver = dragOver === dow;
              return (
                <div
                  key={dow}
                  className={"mb-pe-day" + (isOver ? " drag-over" : "")}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(dow); }}
                  onDragLeave={() => setDragOver((cur) => cur === dow ? null : cur)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(null);
                    if (dragging) {
                      moveTo(dragging.dow, dragging.idx, dow);
                      setDragging(null);
                    }
                  }}
                >
                  <div className="mb-pe-day-head">
                    <div className="serif" style={{ fontSize: 14 }}>{window.MB.DAY_LABELS_FULL[dow]}</div>
                    <button className="btn btn-sm btn-ghost" onClick={() => addWorkout(dow)} title="Add workout">
                      <Icon name="plus" size={14}/>
                    </button>
                  </div>
                  <div className="mb-pe-day-body">
                    {items.length === 0 && (
                      <div className="mb-pe-empty">Rest · drop or +</div>
                    )}
                    {items.map((w, idx) => {
                      const meta = window.MB.TYPE_META[w.type];
                      const isEd = editing?.dow === dow && editing?.idx === idx;
                      return (
                        <div
                          key={w.id + idx}
                          className={"mb-pe-card" + (isEd ? " is-editing" : "")}
                          draggable
                          onDragStart={() => setDragging({ dow, idx })}
                          onDragEnd={() => setDragging(null)}
                          onClick={() => setEditing({ dow, idx })}
                          style={{ borderLeftColor: meta.color }}
                        >
                          <div className="mb-pe-card-top">
                            <span className="mb-pe-tag" style={{ background: meta.bg, color: meta.color }}>
                              <Icon name={TYPE_ICON[w.type] || "boot"} size={10} stroke={2}/>
                              {meta.label}
                            </span>
                            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{w.time}</span>
                          </div>
                          <div className="mb-pe-card-title">{w.title}</div>
                          <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                            {w.durationMin}m · +{w.meters}m
                          </div>
                          <button
                            className="mb-pe-del"
                            onClick={(e) => { e.stopPropagation(); deleteWorkout(dow, idx); }}
                            title="Delete"
                          ><Icon name="x" size={11} stroke={2.4}/></button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inspector */}
          {editing && cur && (
            <div className="mb-pe-inspector">
              <div className="smallcaps" style={{ color: "var(--ink-3)", marginBottom: 10 }}>
                {window.MB.DAY_LABELS_FULL[editing.dow]} · workout details
              </div>

              <Field label="Title">
                <input style={inputStyle} value={cur.title}
                  onChange={(e) => updateWorkout(editing.dow, editing.idx, { title: e.target.value })}/>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Field label="Type">
                  <select style={inputStyle} value={cur.type}
                    onChange={(e) => {
                      const t = e.target.value;
                      const preset = TYPE_PRESETS[t] || {};
                      updateWorkout(editing.dow, editing.idx, { type: t, ...preset });
                    }}>
                    <option value="aerobic">Aerobic</option>
                    <option value="strength">Strength</option>
                    <option value="micro">Micro (10 min)</option>
                    <option value="rest">Rest / mobility</option>
                  </select>
                </Field>
                <Field label="Time">
                  <input type="time" style={inputStyle} value={cur.time}
                    onChange={(e) => updateWorkout(editing.dow, editing.idx, { time: e.target.value })}/>
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Field label="Duration (min)">
                  <input type="number" style={inputStyle} value={cur.durationMin}
                    onChange={(e) => updateWorkout(editing.dow, editing.idx, { durationMin: +e.target.value })}/>
                </Field>
                <Field label="Altitude reward (m)">
                  <input type="number" style={inputStyle} value={cur.meters}
                    onChange={(e) => updateWorkout(editing.dow, editing.idx, { meters: +e.target.value })}/>
                </Field>
              </div>

              <Field label="Move to day">
                <select style={inputStyle} value={editing.dow}
                  onChange={(e) => {
                    const toDow = +e.target.value;
                    moveTo(editing.dow, editing.idx, toDow);
                    const newIdx = (plan.template[toDow]?.length || 0); // appended
                    setEditing({ dow: toDow, idx: newIdx });
                  }}>
                  {window.MB.DAY_LABELS_FULL.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </Field>

              <div style={{ marginTop: 6, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                <div className="smallcaps" style={{ color: "var(--alpen-2)", marginBottom: 8 }}>Habit loop</div>
                <Field label="Cue (when / trigger)">
                  <input style={inputStyle} value={cur.cue}
                    onChange={(e) => updateWorkout(editing.dow, editing.idx, { cue: e.target.value })}/>
                </Field>
                <Field label="Craving (why)">
                  <input style={inputStyle} value={cur.craving}
                    onChange={(e) => updateWorkout(editing.dow, editing.idx, { craving: e.target.value })}/>
                </Field>
                <Field label="Response (what you do)">
                  <input style={inputStyle} value={cur.response}
                    onChange={(e) => updateWorkout(editing.dow, editing.idx, { response: e.target.value })}/>
                </Field>
                <Field label="Reward (the dopamine)">
                  <input style={inputStyle} value={cur.reward}
                    onChange={(e) => updateWorkout(editing.dow, editing.idx, { reward: e.target.value })}/>
                </Field>
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                <button className="btn" onClick={() => setEditing(null)}>Done</button>
                <button className="btn btn-ghost" style={{ color: "var(--alpen-1)" }}
                  onClick={() => deleteWorkout(editing.dow, editing.idx)}>
                  Delete workout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.PlanEditor = PlanEditor;
