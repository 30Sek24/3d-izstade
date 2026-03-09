export default function WarpalaLogo({ size = 150, showText = true }: { size?: number, showText?: boolean }) {
  const width = size * 2.8; 
  const height = size;

  return (
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <svg width={showText ? width : size * 0.8} height={height} viewBox="0 0 420 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Enerģijas/Warp līnija */}
        <g>
          <path 
            d="M40 80 Q60 40 80 80 T120 80"
            stroke="#F97316"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          >
            <animate 
              attributeName="stroke-dasharray" 
              from="0, 500" 
              to="500, 0" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </path>
          <path 
            d="M40 80 Q60 40 80 80 T120 80"
            stroke="#F97316"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity="0.2"
            style={{ filter: 'blur(8px)' }}
          />
        </g>

        {showText && (
          <>
            <text 
              x="140" 
              y="95"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="64"
              fontWeight="900"
              fill="#000000"
              letterSpacing="-2"
            >
              Warpala
            </text>
            <text 
              x="145" 
              y="130"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="20"
              fontWeight="700"
              fill="#F97316"
              letterSpacing="8"
              style={{ textTransform: 'uppercase' }}
            >
              Expo City
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
