import React, { useEffect, useRef } from 'react';

/**
 * AdminMatrixRain Component
 * Renders a matrix-style falling character effect on a canvas background.
 * Optimized for performance with requestAnimationFrame and HiDPI support.
 */
const AdminMatrixRain = () => {
    const canvasRef = useRef(null);
    const animationIdRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
        };

        setCanvasSize();

        const fontSize = 14;
        const columnWidth = 20;
        let columns = Math.floor(window.innerWidth / columnWidth);
        let drops = Array(columns).fill(0).map(() => Math.random() * -100);

        // Character set: Katakana + Digits
        const chars = '0123456789\u30A0\u30A1\u30A2\u30A3\u30A4\u30A5\u30A6\u30A7\u30A8\u30A9\u30AA\u30AB\u30AC\u30AD\u30AE\u30AF\u30B0\u30B1\u30B2\u30B3\u30B4\u30B5\u30B6\u30B7\u30B8\u30B9\u30BA\u30BB\u30BC\u30BD\u30BE\u30BF\u30C0\u30C1\u30C2\u30C3\u30C4\u30C5\u30C6\u30C7\u30C8\u30C9\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D0\u30D1\u30D2\u30D3\u30D4\u30D5\u30D6\u30D7\u30D8\u30D9\u30DA\u30DB\u30DC\u30DD\u30DE\u30DF\u30E0\u30E1\u30E2\u30E3\u30E4\u30E5\u30E6\u30E7\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F0\u30F1\u30F2\u30F3\u30F4\u30F5\u30F6\u30F7\u30F8\u30F9\u30FA';

        const draw = () => {
            // Dark trail fade
            ctx.fillStyle = 'rgba(2, 4, 8, 0.05)';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            // Set text style
            ctx.fillStyle = '#00ff8c';
            ctx.globalAlpha = 0.08; // 8% opacity as per plan
            ctx.font = `${fontSize}px "JetBrains Mono"`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                const x = i * columnWidth;
                const y = drops[i] * columnWidth;

                ctx.fillText(text, x, y);

                // Reset drop if it goes off screen
                if (y > window.innerHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }

            animationIdRef.current = requestAnimationFrame(draw);
        };

        draw();

        const resizeObserver = new ResizeObserver(() => {
            setCanvasSize();
            columns = Math.floor(window.innerWidth / columnWidth);
            drops = Array(columns).fill(0).map(() => Math.random() * -100);
        });

        resizeObserver.observe(document.body);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0
            }}
            aria-hidden="true"
        />
    );
};

export default AdminMatrixRain;
