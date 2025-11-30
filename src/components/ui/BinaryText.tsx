import React, { useState, useEffect, useRef } from 'react';

interface BinaryTextProps {
    text: string;
    className?: string;
    revealSpeed?: number;
}

const BinaryText: React.FC<BinaryTextProps> = ({
    text,
    className = '',
    revealSpeed = 50,
}) => {
    const [displayText, setDisplayText] = useState('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
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
                        // Return random 0 or 1
                        return Math.random() > 0.5 ? "1" : "0";
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
            }

            iteration += 1 / 3;
        }, revealSpeed);

        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, [text, revealSpeed]);

    return (
        <span className={`${className} font-mono`}>
            {displayText}
        </span>
    );
};

export default BinaryText;
