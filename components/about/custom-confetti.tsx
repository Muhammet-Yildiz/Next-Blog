"use client"
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export const CustomConfetti = () => {

    const searchParams = useSearchParams();

    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);

        const shouldShowConfetti = !!searchParams.get('confetti');
        if (shouldShowConfetti) {
            setShowConfetti(true);

            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 5000);

            return () => clearTimeout(timer);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [searchParams]);

    return (

        showConfetti && (
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={showConfetti}
                numberOfPieces={300}
                gravity={0.2}
                colors={['#7D3CED', '#D1C4E9', '#5C2C91', '#A29BFE', '#E0BBE4', '#9B59B6', '#B39DDB', '#8E44AD', '#C6A0D6', '#D5AAFF']}
                drawShape={ctx => {
                    const shapeType = Math.random(); 

                    if (shapeType > 0.5) {
                        ctx.beginPath();
                        const radius = 5;
                        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        const size = 8;
                        ctx.fillRect(-size / 2, -size / 2, size, size);
                    }
                }}
            />
        )
    );
}