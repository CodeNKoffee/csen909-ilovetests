import { useId } from 'react';
// Lukki: our own mascot, a small round "gap finder" with a glowing antenna and a magnifying glass.
type Mood = 'happy' | 'cheer' | 'think' | 'wave';

export default function Lukki({ size = 72, mood = 'happy', className = '' }: { size?: number; mood?: Mood; className?: string }) {
  const id = useId().replace(/:/g, '');
  const navy = '#102C41';
  const mouth = {
    happy: <path d="M51 70 Q60 78 69 70" stroke={navy} strokeWidth="3.2" fill="none" strokeLinecap="round" />,
    cheer: <><path d="M47 66 Q60 86 73 66 Z" fill={navy} /><path d="M53 76 Q60 71 67 76 Q60 82 53 76 Z" fill="#6EB9F2" /></>,
    think: <path d="M54 72 Q60 69 66 72" stroke={navy} strokeWidth="3.2" fill="none" strokeLinecap="round" />,
    wave: <path d="M51 70 Q60 78 69 70" stroke={navy} strokeWidth="3.2" fill="none" strokeLinecap="round" />,
  }[mood];
  const look = mood === 'think' ? [2, -3] : [0, 0];
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label="Lukki">
      <defs>
        <radialGradient id={`b${id}`} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor="#A9DAFB" /><stop offset=".55" stopColor="#6EB9F2" /><stop offset="1" stopColor="#4790CD" />
        </radialGradient>
        <radialGradient id={`t${id}`} cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#D6E9F8" /></radialGradient>
        <radialGradient id={`l${id}`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#CFE6F8" /></radialGradient>
        <radialGradient id={`g${id}`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#6EB9F2" /></radialGradient>
      </defs>
      <ellipse cx="60" cy="111" rx="32" ry="4.5" fill={navy} opacity=".12" />
      {/* antenna with a glowing tip: it lights up when it finds a gap */}
      <path d="M60 26 C60 16 66 11 72 12" stroke="#4790CD" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <circle cx="73" cy="12" r="7.5" fill="#6EB9F2" opacity=".28" />
      <circle cx="73" cy="12" r="5" fill={`url(#g${id})`} stroke="#4790CD" strokeWidth="1.8" />
      {/* feet */}
      <ellipse cx="46" cy="104" rx="10" ry="5.5" fill="#2F78B8" /><ellipse cx="74" cy="104" rx="10" ry="5.5" fill="#2F78B8" />
      {/* body */}
      <path d="M20 68 C20 40 37 24 60 24 C83 24 100 40 100 68 C100 93 84 106 60 106 C36 106 20 93 20 68 Z" fill={`url(#b${id})`} />
      <path d="M96 62 C99 86 84 106 60 106 C42 106 30 98 24 86 C40 99 80 98 96 62 Z" fill="#2F78B8" opacity=".22" />
      <path d="M32 44 C38 32 48 28 58 28" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".55" />
      <ellipse cx="60" cy="86" rx="25" ry="17" fill={`url(#t${id})`} />
      {/* cheeks */}
      <ellipse cx="36" cy="68" rx="6.5" ry="4.2" fill="#4790CD" opacity=".3" />
      <ellipse cx="84" cy="68" rx="6.5" ry="4.2" fill="#4790CD" opacity=".3" />
      {/* eyes */}
      {mood === 'cheer' ? (
        <>
          <path d="M38 54 Q46 42 54 54" stroke={navy} strokeWidth="4.2" fill="none" strokeLinecap="round" />
          <path d="M66 54 Q74 42 82 54" stroke={navy} strokeWidth="4.2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="46" cy="54" rx="9" ry="10.5" fill="#fff" /><circle cx={47 + look[0]} cy={55 + look[1]} r="5.6" fill={navy} /><circle cx={49 + look[0]} cy={52 + look[1]} r="1.9" fill="#fff" />
          <ellipse cx="74" cy="54" rx="9" ry="10.5" fill="#fff" /><circle cx={75 + look[0]} cy={55 + look[1]} r="5.6" fill={navy} /><circle cx={77 + look[0]} cy={52 + look[1]} r="1.9" fill="#fff" />
          {mood === 'think' && <><path d="M37 40 Q45 35 53 38" stroke={navy} strokeWidth="2.8" fill="none" strokeLinecap="round" /><path d="M67 38 Q75 35 83 40" stroke={navy} strokeWidth="2.8" fill="none" strokeLinecap="round" /></>}
        </>
      )}
      {mouth}
      {/* arm, and magnifying glass in the other hand */}
      {mood === 'wave' ? (
        <path d="M23 72 Q9 62 11 46" stroke="#2F78B8" strokeWidth="7" strokeLinecap="round" fill="none" />
      ) : (
        <>
          <path d="M96 74 Q106 72 107 63" stroke="#2F78B8" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M110 40 L117 30" stroke={navy} strokeWidth="5" strokeLinecap="round" />
          <circle cx="105" cy="52" r="12" fill={`url(#l${id})`} stroke={navy} strokeWidth="3.6" />
          <path d="M98 48 Q101 43 107 43" stroke="#6EB9F2" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood !== 'wave' && <circle cx="107" cy="63" r="4.5" fill="#2F78B8" />}
    </svg>
  );
}
