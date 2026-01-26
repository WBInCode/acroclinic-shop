export function WireframeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg
        className="w-full h-full opacity-10"
        style={{ animation: 'wireframe-pulse 8s ease-in-out infinite' }}
      >
        <defs>
          <pattern
            id="wireframe-grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="oklch(0.72 0.15 85)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="wireframe-diagonal"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 50 L 50 0"
              fill="none"
              stroke="oklch(0.72 0.15 85)"
              strokeWidth="0.3"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wireframe-grid)" />
        <rect width="100%" height="100%" fill="url(#wireframe-diagonal)" />
        <circle
          cx="20%"
          cy="30%"
          r="200"
          fill="none"
          stroke="oklch(0.72 0.15 85)"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <circle
          cx="80%"
          cy="70%"
          r="150"
          fill="none"
          stroke="oklch(0.72 0.15 85)"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
    </div>
  )
}
