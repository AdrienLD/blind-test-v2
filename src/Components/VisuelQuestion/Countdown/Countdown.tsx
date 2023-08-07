import React, { useState, useEffect } from 'react';
import './Countdown.css';

function Countdown() {
    const [timeLeft, setTimeLeft] = useState(10);
    const [millisecondsLeft, setMillisecondsLeft] = useState(1000);
    const circumference = 2 * Math.PI * 70; // Rayon de 70
    const strokeDashoffset = (millisecondsLeft / 1000) * circumference;

    useEffect(() => {
        if (millisecondsLeft > 0) {
            const timer = setTimeout(() => {
                setMillisecondsLeft(millisecondsLeft - 10);
            }, 10); // On diminue toutes les 10 millisecondes pour une précision plus grande
            return () => clearTimeout(timer);
        } else {
            setTimeLeft(timeLeft - 1);
            setMillisecondsLeft(1000);
        }
    }, [millisecondsLeft, timeLeft]);

    return (
        <div className="countdown">
            <div className="circle-container">
                <h1 className='timeLeft'>{timeLeft}</h1>
                <svg width="168" height="168" viewBox="0 0 168 168">
                    <circle
                        cx="84"
                        cy="84"
                        r="70"
                        fill="none"
                        stroke="purple"
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90, 84, 84)"
                    />
                </svg>
            </div>
        </div>
    );
}

export default Countdown;
