// Hand-tuned SVG icon set — line-style, evokes maps & expedition gear
const Icon = ({ name, size = 18, stroke = 1.6, color = "currentColor", style }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case "mountain":
      return (<svg {...props}><path d="M3 19l5.5-9 3 5 2.5-4 7 8z"/><path d="M8.5 10l1.7 2.8" /></svg>);
    case "peak":
      return (<svg {...props}><path d="M2 20l7-12 4 7 3-4 6 9z"/><path d="M9 8l-1.5-3 5-1 1 3"/></svg>);
    case "boot":
      return (<svg {...props}><path d="M5 14V5h4l1 3h2l3 3h3a2 2 0 012 2v3H5z"/><path d="M9 17v2M13 17v2M17 17v2"/></svg>);
    case "compass":
      return (<svg {...props}><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5L11 13l-2 2 3.5-1 2-3.5z"/></svg>);
    case "flag":
      return (<svg {...props}><path d="M5 4v16"/><path d="M5 4h11l-2 3.5L16 11H5"/></svg>);
    case "calendar":
      return (<svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>);
    case "check":
      return (<svg {...props}><path d="M4 12l5 5L20 6"/></svg>);
    case "circle":
      return (<svg {...props}><circle cx="12" cy="12" r="9"/></svg>);
    case "music":
      return (<svg {...props}><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>);
    case "share":
      return (<svg {...props}><path d="M12 4v12"/><path d="M7 9l5-5 5 5"/><path d="M5 16v3a1 1 0 001 1h12a1 1 0 001-1v-3"/></svg>);
    case "download":
      return (<svg {...props}><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>);
    case "plus":
      return (<svg {...props}><path d="M12 5v14M5 12h14"/></svg>);
    case "edit":
      return (<svg {...props}><path d="M4 20l3-1L19 7l-3-3L4 16z"/><path d="M14 6l3 3"/></svg>);
    case "settings":
      return (<svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.4.9a7 7 0 00-2-1.2L14 3h-4l-.5 2.5a7 7 0 00-2 1.2L5 5.8l-2 3.5 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.9a7 7 0 002 1.2L10 21h4l.5-2.5a7 7 0 002-1.2l2.4.9 2-3.5-2-1.5z"/></svg>);
    case "chevron-left":
      return (<svg {...props}><path d="M15 6l-6 6 6 6"/></svg>);
    case "chevron-right":
      return (<svg {...props}><path d="M9 6l6 6-6 6"/></svg>);
    case "x":
      return (<svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>);
    case "tent":
      return (<svg {...props}><path d="M3 20l9-15 9 15z"/><path d="M12 5v15M9 20l3-4 3 4"/></svg>);
    case "snowflake":
      return (<svg {...props}><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>);
    case "sun":
      return (<svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>);
    case "dumbbell":
      return (<svg {...props}><path d="M3 9v6M21 9v6M5 7v10M19 7v10M7 11h10M7 13h10"/></svg>);
    case "run":
      return (<svg {...props}><circle cx="14" cy="4.5" r="1.6"/><path d="M9 21l3-5 2 1 2-4-4-2-3 3-2-1"/><path d="M5 13l2-3 4 0"/></svg>);
    case "stretch":
      return (<svg {...props}><circle cx="12" cy="4" r="1.6"/><path d="M12 6v6M9 18h6M8 13l4-1 4 1M10 18l-2 3M14 18l2 3"/></svg>);
    case "trail":
      return (<svg {...props}><path d="M4 20c2-1 2-4 4-4s2 3 4 3 2-5 4-5 2 3 4 2"/></svg>);
    case "rope":
      return (<svg {...props}><path d="M4 12s2-3 4-3 2 6 4 6 2-6 4-6 4 3 4 3"/></svg>);
    case "send":
      return (<svg {...props}><path d="M4 20l16-8L4 4l3 8z"/><path d="M7 12h13"/></svg>);
    case "info":
      return (<svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/></svg>);
    case "lightbulb":
      return (<svg {...props}><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3 11c1 1 1 2 1 3h4c0-1 0-2 1-3a6 6 0 00-3-11z"/></svg>);
    case "target":
      return (<svg {...props}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={color}/></svg>);
    case "sparkle":
      return (<svg {...props}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>);
    default:
      return null;
  }
};

window.Icon = Icon;
