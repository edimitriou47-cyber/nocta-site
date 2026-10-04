export default function Mark() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Nocta Studios N mark with an orbit ring and a star">
      <defs>
        <linearGradient id="n" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E8ECF4" /><stop offset="1" stopColor="#8FA8FF" /></linearGradient>
        <filter id="g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <radialGradient id="h"><stop offset="0" stopColor="#8FA8FF" stopOpacity=".22" /><stop offset="1" stopColor="#8FA8FF" stopOpacity="0" /></radialGradient>
      </defs>
      <circle className="halo" cx="200" cy="215" r="190" fill="url(#h)" />
      <circle cx="200" cy="200" r="196" fill="none" stroke="#E8ECF4" strokeOpacity=".25" />
      <polyline className="draw" pathLength={1} points="120,320 120,70 280,320 280,110" fill="none" stroke="url(#n)" strokeWidth="9" strokeLinejoin="miter" filter="url(#g)" />
      <ellipse className="draw draw-late" pathLength={1} cx="200" cy="235" rx="175" ry="40" transform="rotate(-14 200 235)" fill="none" stroke="#E8ECF4" strokeWidth="3" filter="url(#g)" />
      <path className="star" d="M300 22 L305 45 L328 50 L305 55 L300 78 L295 55 L272 50 L295 45 Z" fill="#E8ECF4" filter="url(#g)" />
    </svg>
  );
}
