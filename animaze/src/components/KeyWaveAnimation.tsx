import React, { useEffect, useState } from 'react';
import '../styles/KeyWaveAnimation.css';

interface KeyWaveAnimationProps {
    triggerId: number;
}

interface Wave {
    id: number;
    color: string;
}

const COLORS = [
    '#FADADD', '#FFDAB9', '#FFF9C4', '#B2F2BB', '#B3E5FC', 
    '#E1BEE7', '#FFC0CB', '#B2DFDB', '#D1C4E9', '#FFCCBC'
];

export const KeyWaveAnimation: React.FC<KeyWaveAnimationProps> = ({ triggerId }) => {
    const [waves, setWaves] = useState<Wave[]>([]);

    useEffect(() => {
        if (triggerId === 0) return;

        const newWave: Wave = {
            id: triggerId,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        };

        setWaves(prev => [...prev, newWave]);

        // Cleanup wave after animation completes
        const timeout = setTimeout(() => {
            setWaves(prev => prev.filter(w => w.id !== triggerId));
        }, 1500); // Match animation duration

        return () => clearTimeout(timeout);
    }, [triggerId]);

    return (
        <div className="key-wave-container">
            {waves.map(wave => (
                <div 
                    key={wave.id} 
                    className="wave-circle" 
                    style={{ backgroundColor: wave.color }}
                />
            ))}
        </div>
    );
};
