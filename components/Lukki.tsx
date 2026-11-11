// Lukki: our own mascot, a small round "gap finder" holding a magnifying glass.
type Mood = 'happy' | 'cheer' | 'think' | 'wave';

export default function Lukki({ size = 72, mood = 'happy', className = '' }: { size?: number; mood?: Mood; className?: string }) {
  const mouth = {
    happy: <path d="M50 66 Q60 75 70 66" stroke="#102C41" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    cheer: <path d="M48 64 Q60 80 72 64 Z" fill="#102C41" />,
    think: <path d="M52 69 Q60 66 68 69" stroke="#102C41" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    wave: <path d="M50 66 Q60 75 70 66" stroke="#102C41" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
  }[mood];
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label="Lukki">
      {/* antenna curl */}
      <path d="M60 22 C60 12 70 10 72 16 C74 22 66 24 66 18" stroke="#4790CD" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* body */}
      <path d="M22 66 C22 38 38 24 60 24 C82 24 98 38 98 66 C98 92 82 104 60 104 C38 104 22 92 22 66 Z" fill="#6EB9F2" />
      <ellipse cx="60" cy="80" rx="24" ry="18" fill="#E3F0FB" />
      {/* cheeks */}
      <ellipse cx="38" cy="66" rx="6" ry="4" fill="#4790CD" opacity=".35" />
      <ellipse cx="82" cy="66" rx="6" ry="4" fill="#4790CD" opacity=".35" />
      {/* eyes */}
      {mood === 'cheer' ? (
        <>
          <path d="M40 52 Q47 44 54 52" stroke="#102C41" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M66 52 Q73 44 80 52" stroke="#102C41" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="47" cy="52" rx="8" ry="9" fill="#fff" /><circle cx={mood === 'think' ? 49 : 48} cy={mood === 'think' ? 49 : 53} r="4.5" fill="#102C41" />
          <ellipse cx="73" cy="52" rx="8" ry="9" fill="#fff" /><circle cx={mood === 'think' ? 75 : 74} cy={mood === 'think' ? 49 : 53} r="4.5" fill="#102C41" />
        </>
      )}
      {mouth}
      {/* feet */}
      <ellipse cx="48" cy="104" rx="9" ry="5" fill="#4790CD" /><ellipse cx="72" cy="104" rx="9" ry="5" fill="#4790CD" />
      {/* arm + magnifying glass */}
      <path d={mood === 'wave' ? 'M24 70 Q12 58 14 44' : 'M96 72 Q104 72 106 64'} stroke="#4790CD" strokeWidth="6" strokeLinecap="round" fill="none" />
      {mood !== 'wave' && (
        <g>
          <circle cx="106" cy="52" r="10" fill="#F8FBFE" stroke="#102C41" strokeWidth="3.5" />
          <path d="M100 47 Q103 44 107 45" stroke="#6EB9F2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
