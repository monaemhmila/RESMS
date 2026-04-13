import React, { useState, useEffect, useRef } from 'react';

function CountUpComponent({ targetNumber }) {
    const [count, setCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (typeof targetNumber !== 'number') return;

        // Clear any existing interval
        if (intervalRef.current) clearInterval(intervalRef.current);

        setCount(0);

        if (targetNumber === 0) return;

        const duration = 700; // total animation time in ms
        const steps = Math.min(targetNumber, 60); // cap at 60 steps regardless of target
        const increment = targetNumber / steps;
        const intervalTime = duration / steps;

        let current = 0;
        intervalRef.current = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                setCount(targetNumber);
                clearInterval(intervalRef.current);
            } else {
                setCount(Math.floor(current));
            }
        }, intervalTime);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [targetNumber]); // ← only depends on targetNumber, NOT count

    return <span>{typeof targetNumber === 'number' ? count : targetNumber}</span>;
}

export default CountUpComponent;
