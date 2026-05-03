// Tweaks panel — palette, layout density, habit-loop visibility, week-view variant
const MBTweaks = ({ tweaks, setTweak }) => {
  return (
    <TweaksPanel>
      <TweakSection label="Palette" />
      <TweakRadio
        label="Color story"
        value={tweaks.palette}
        onChange={(v) => setTweak("palette", v)}
        options={[
          { value: "alpenglow", label: "Alpenglow" },
          { value: "glacier", label: "Glacier" },
          { value: "forest", label: "Forest" },
        ]}
      />

      <TweakSection label="Habit loop" />
      <TweakToggle
        label="Show cue / craving / response / reward"
        value={tweaks.showHabitLoop}
        onChange={(v) => setTweak("showHabitLoop", v)}
      />

      <TweakSection label="Layout" />
      <TweakRadio
        label="Density"
        value={tweaks.density}
        onChange={(v) => setTweak("density", v)}
        options={[
          { value: "compact", label: "Compact" },
          { value: "cozy", label: "Cozy" },
          { value: "roomy", label: "Roomy" },
        ]}
      />
      <TweakRadio
        label="Mountain"
        value={tweaks.mountainStyle}
        onChange={(v) => setTweak("mountainStyle", v)}
        options={[
          { value: "illustration", label: "Illus." },
          { value: "rail", label: "Rail" },
          { value: "both", label: "Both" },
        ]}
      />

      <TweakSection label="Reward" />
      <TweakToggle
        label="Confetti dopamine burst"
        value={tweaks.confetti}
        onChange={(v) => setTweak("confetti", v)}
      />
    </TweaksPanel>
  );
};

window.MBTweaks = MBTweaks;
