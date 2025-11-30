import React, { useState, useEffect } from 'react';

interface TerminalTextProps {
    text: string | string[];
    className?: string;
    typingSpeed?: number;
    deleteSpeed?: number;
    delayBetween?: number;
    cursorColor?: string;
}

const TerminalText: React.FC<TerminalTextProps> = ({
    text,
    className = '',
    typingSpeed = 100,
    deleteSpeed = 50,
    delayBetween = 2000,
    cursorColor = 'bg-cyan-400',
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const textArray = Array.isArray(text) ? text : [text];
        const currentText = textArray[loopNum % textArray.length];

        const handleTyping = () => {
            setDisplayedText((prev) => {
                if (isDeleting) {
                    return currentText.substring(0, prev.length - 1);
                } else {
                    return currentText.substring(0, prev.length + 1);
                }
            });

            if (!isDeleting && displayedText === currentText) {
                setTimeout(() => setIsDeleting(true), delayBetween);
            } else if (isDeleting && displayedText === '') {
                setIsDeleting(false);
                setLoopNum((prev) => prev + 1);
            }
        };

        const timer = setTimeout(
            handleTyping,
            isDeleting ? deleteSpeed : typingSpeed
        );

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, loopNum, text, typingSpeed, deleteSpeed, delayBetween]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <span className={`${className} font-mono inline-flex items-center`}>
            {displayedText}
            <span
                className={`inline-block w-3 h-5 ml-1 ${cursorColor} ${showCursor ? 'opacity-100' : 'opacity-0'
                    }`}
            ></span>
        </span>
    );
};

export default TerminalText;
