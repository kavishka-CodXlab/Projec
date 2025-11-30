import React from 'react';
import { motion, Variants } from 'framer-motion';

interface RevealTextProps {
    text: string;
    className?: string;
    delay?: number;
}

const RevealText: React.FC<RevealTextProps> = ({ text, className = '', delay = 0 }) => {
    const words = text.split(' ');

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay,
            },
        },
    };

    const child: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: 'blur(10px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`inline-block ${className}`}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    className="inline-block mr-1.5 last:mr-0"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default RevealText;
