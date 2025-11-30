import React, { useEffect, useState, useRef } from 'react';

interface ScrambleTextProps {
    text: string;
    className?: string;
    scrambleSpeed?: number;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
    text,
    className = '',
    scrambleSpeed = 30,
}) => {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const chars = '!<>-_\\/[]{}—=+*^?#________';

    const scramble = () => {
        if (isScrambling) return;
        setIsScrambling(true);

        let iteration = 0;

        clearInterval(intervalRef.current as NodeJS.Timeout);

        intervalRef.current = setInterval(() => {
            setDisplayText(() =>
                text
                    .split("")
                    .map((_letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
                setIsScrambling(false);
            }

            iteration += 1 / 3;
        }, scrambleSpeed);
    };

    useEffect(() => {
        scramble();
        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, [text]);

    return (
        <span
            className={`inline-block font-mono cursor-default ${className}`}
            onMouseEnter={scramble}
        >
            {displayText}
        </span>
    );
};

export default ScrambleText;
