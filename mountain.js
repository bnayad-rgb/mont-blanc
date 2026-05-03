// Mont Blanc silhouette + topographic decorations
// MountainProgress: layered alpine illustration; snow line rises with altitude.

const MontBlancSilhouette = ({ width = 260, height = 160, altitude = 0, summit = 4808, showLabels = true }) => {
  const pct = Math.max(0, Math.min(1, altitude / summit));
  // Snow line — top of mountain at pct=1, base at pct=0
  // Use a clipPath to fill upper portion of peak with snow.
  const snowLineY = 24 + (130 - 24) * (1 - pct); // 24=peak, 130=base region

  return (
    <svg width={width} height={height} viewBox="0 0 260 160" style={{ display: "block" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5C99B" />
          <stop offset="0.5" stopColor="#E8B58A" />
          <stop offset="1" stopColor="#EAE1CC" />
        </linearGradient>
        <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A4A55" />
          <stop offset="1" stopColor="#22323E" />
        </linearGradient>
        <linearGradient id="rockMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4F84A8" />
          <stop offset="1" stopColor="#2E5C7E" />
        </linearGradient>
        <linearGradient id="rockFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A5A3F" />
          <stop offset="1" stopColor="#2C4632" />
        </linearGradient>
        <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DDE6EC" />
        </linearGradient>
        {/* Clip the front mountain so snow only appears above the snow line */}
        <clipPath id="peakClip">
          <path d="M70 130 L130 30 L 200 130 Z" />
        </clipPath>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="260" height="140" fill="url(#sky)" />

      {/* Sun / moon */}
      <circle cx="210" cy="38" r="14" fill="#F7CDA9" opacity="0.85" />
      <circle cx="210" cy="38" r="9" fill="#F2A878" opacity="0.9" />

      {/* Far back peaks */}
      <path d="M-10 130 L 30 80 L 60 110 L 90 70 L 120 100 L 160 60 L 200 95 L 240 75 L 280 130 Z"
            fill="url(#rock)" opacity="0.55" />

      {/* Mid peaks */}
      <path d="M-10 135 L 20 100 L 50 120 L 90 85 L 140 115 L 180 95 L 220 120 L 280 135 Z"
            fill="url(#rockMid)" opacity="0.7" />

      {/* Mont Blanc — front peak */}
      <path d="M70 130 L130 30 L 200 130 Z" fill="url(#rockMid)" />

      {/* Snow cap — clipped to peak shape, height by altitude */}
      <g clipPath="url(#peakClip)">
        <rect x="60" y="20" width="160" height={Math.max(0, snowLineY - 20)} fill="url(#snowGrad)" />
        {/* irregular snow lower edge */}
        <path
          d={`M60 ${snowLineY} Q 90 ${snowLineY + 6} 110 ${snowLineY - 3} T 160 ${snowLineY + 4} T 220 ${snowLineY - 2} L 220 ${snowLineY - 18} L 60 ${snowLineY - 18} Z`}
          fill="url(#snowGrad)"
        />
      </g>

      {/* Peak outline + ridge shadow */}
      <path d="M70 130 L130 30 L 200 130" fill="none" stroke="#1E4866" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M130 30 L 150 70 L 138 90 L 165 130" fill="none" stroke="#14202B" strokeWidth="0.8" opacity="0.4"/>

      {/* Foreground hill */}
      <path d="M-10 140 Q 60 125 130 140 T 280 138 L 280 160 L -10 160 Z" fill="url(#rockFront)" />

      {/* A little hiker silhouette climbing — position by altitude */}
      <g transform={`translate(${110 + pct * 18}, ${130 - pct * 96})`} opacity="0.95">
        <circle cx="0" cy="-4" r="1.6" fill="#14202B"/>
        <path d="M0 -3 L 0 2 L -2 6 M 0 2 L 2 6 M -2 -1 L 2 -1" stroke="#14202B" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        {/* Flag at summit when complete */}
        {pct > 0.98 && (
          <g transform="translate(2, -10)">
            <path d="M0 0 L 0 -8 L 5 -6 L 0 -4" fill="#E8804C" stroke="#C45A2C" strokeWidth="0.6"/>
          </g>
        )}
      </g>

      {/* Trail — dashed line from base to hiker */}
      <path
        d={`M 130 138 Q 120 130 ${118 + pct * 14} ${134 - pct * 96}`}
        fill="none" stroke="#14202B" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5"
      />

      {showLabels && (
        <g>
          <text x="130" y="22" textAnchor="middle" fontFamily="Newsreader, serif" fontSize="9" fill="#14202B" opacity="0.7">4 808 m</text>
        </g>
      )}
    </svg>
  );
};

// Topo contour decoration band (used as dividers / accents)
const TopoBand = ({ height = 40, opacity = 0.18 }) => (
  <svg width="100%" height={height} viewBox="0 0 800 40" preserveAspectRatio="none" style={{ display: "block" }}>
    <g fill="none" stroke="#14202B" strokeWidth="0.6" opacity={opacity}>
      <path d="M0 20 Q 100 8 200 20 T 400 20 T 600 20 T 800 20"/>
      <path d="M0 26 Q 100 14 200 26 T 400 26 T 600 26 T 800 26"/>
      <path d="M0 14 Q 100 2 200 14 T 400 14 T 600 14 T 800 14"/>
      <path d="M0 32 Q 100 20 200 32 T 400 32 T 600 32 T 800 32"/>
      <path d="M0 8 Q 100 -4 200 8 T 400 8 T 600 8 T 800 8"/>
    </g>
  </svg>
);

// Vertical altitude tick rail
const AltitudeRail = ({ altitude, summit = 4808, height = 220 }) => {
  const pct = Math.max(0, Math.min(1, altitude / summit));
  const ticks = [0, 1000, 2000, 3000, 4000, 4808];
  return (
    <div style={{ position: "relative", height, width: 60, fontFamily: "var(--mono)" }}>
      <div style={{
        position: "absolute", left: 28, top: 0, bottom: 0, width: 2,
        background: "var(--line-strong)",
      }}/>
      {/* fill */}
      <div style={{
        position: "absolute", left: 27, bottom: 0, width: 4,
        height: `${pct * 100}%`,
        background: "linear-gradient(to top, var(--glacier-2), #FFFFFF)",
        borderRadius: 2,
        transition: "height 0.6s cubic-bezier(.2,.8,.2,1)",
      }}/>
      {ticks.map((t) => {
        const y = (1 - t / summit) * 100;
        return (
          <div key={t} style={{
            position: "absolute", left: 0, top: `${y}%`,
            transform: "translateY(-50%)",
            width: 60, display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{
              fontSize: 9, color: "var(--ink-3)",
              minWidth: 22, textAlign: "right",
            }}>{t === 4808 ? "4808" : (t / 1000) + "k"}</span>
            <span style={{ width: 8, height: 1, background: "var(--ink-4)" }}/>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { MontBlancSilhouette, TopoBand, AltitudeRail });
