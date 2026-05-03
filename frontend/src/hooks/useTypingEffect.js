import { useState, useEffect } from 'react';

/**
 * useTypingEffect Hook
 * Simulates a terminal typing effect for an array of strings.
 * @param {string[]} lines - Array of strings to type out.
 * @param {number} speed - Typing speed in ms per character.
 * @returns {object} { displayedText, isDone }
 */
const useTypingEffect = (lines, speed = 35) => {
    const [displayedText, setDisplayedText] = useState('');
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        if (lineIndex >= lines.length) {
            setIsDone(true);
            return;
        }

        const currentLine = lines[lineIndex];

        const timeout = setTimeout(() => {
            if (charIndex < currentLine.length) {
                setDisplayedText(prev => prev + currentLine[charIndex]);
                setCharIndex(prev => prev + 1);
            } else {
                // End of line reached
                setDisplayedText(prev => prev + '\n');
                setLineIndex(prev => prev + 1);
                setCharIndex(0);
            }
        }, speed);

        return () => clearTimeout(timeout);
    }, [lineIndex, charIndex, lines, speed]);

    return { displayedText, isDone };
};

export default useTypingEffect;
