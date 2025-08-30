const COLORS = [
    "#2563EB", // blue
    "#16A34A", // green
    "#F97316", // orange
    "#7C3AED", // violet
    "#E11D48", // rose
    "#0EA5A4", // teal
    "#F59E0B", // amber
];

function hashStringToIndex(s = "") {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h) % COLORS.length;
}

export function svgPlaceholder(initials = "?", size = 128, opts = {}) {
    const radius = opts.rounded ? Math.floor(size * 0.18) : 0;
    const bg = COLORS[hashStringToIndex(initials)];
    const fontSize = Math.floor(size * 0.42);

    const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
      <rect width='100%' height='100%' rx='${radius}' fill='${bg}' />
      <text 
        x='50%' 
        y='50%' 
        text-anchor='middle' 
        dominant-baseline='middle'
        font-family='Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' 
        font-weight='600' 
        font-size='${fontSize}' 
        fill='#ffffff'
      >${initials}</text>
    </svg>
  `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
