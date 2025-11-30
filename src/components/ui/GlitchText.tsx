import React from 'react';

interface GlitchTextProps {
    text: string;
    className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
    return (
        <div className={`relative inline-block group ${className}`}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-blue opacity-0 group-hover:opacity-70 animate-glitch-1 translate-x-[2px]">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-pink opacity-0 group-hover:opacity-70 animate-glitch-2 -translate-x-[2px]">
                {text}
            </span>

            <style>{`
        @keyframes glitch-1 {
          0% { clip-path: inset(20% 0 80% 0); }
          20% { clip-path: inset(60% 0 10% 0); }
          40% { clip-path: inset(40% 0 50% 0); }
          60% { clip-path: inset(80% 0 5% 0); }
          80% { clip-path: inset(10% 0 70% 0); }
          100% { clip-path: inset(30% 0 20% 0); }
        }
        @keyframes glitch-2 {
          0% { clip-path: inset(10% 0 60% 0); }
          20% { clip-path: inset(30% 0 20% 0); }
          40% { clip-path: inset(70% 0 10% 0); }
          60% { clip-path: inset(20% 0 50% 0); }
          80% { clip-path: inset(50% 0 30% 0); }
          100% { clip-path: inset(0% 0 80% 0); }
        }
        .animate-glitch-1 {
          animation: glitch-1 2.5s infinite linear alternate-reverse;
        }
        .animate-glitch-2 {
          animation: glitch-2 3s infinite linear alternate-reverse;
        }
      `}</style>
        </div>
    );
};

export default GlitchText;
