import React, { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
}

interface ShootingStar {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
}

const StarBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        let shootingStars: ShootingStar[] = [];
        let parentElement: HTMLElement | null = canvas.parentElement;

        const initStars = (width: number, height: number) => {
            stars = [];
            const starCount = Math.floor((width * height) / 3000);
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2 + 1, // Increased size: 1px to 3px
                    opacity: Math.random() * 0.5 + 0.5, // Increased opacity: 0.5 to 1.0
                    speed: Math.random() * 0.02 + 0.005,
                });
            }
        };

        const resizeCanvas = () => {
            if (parentElement) {
                canvas.width = parentElement.clientWidth;
                canvas.height = parentElement.clientHeight;
                initStars(canvas.width, canvas.height);
            }
        };

        // Use ResizeObserver for robust sizing
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });

        if (parentElement) {
            resizeObserver.observe(parentElement);
        }

        const createShootingStar = () => {
            if (Math.random() < 0.015 && shootingStars.length < 2) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height / 2),
                    length: Math.random() * 80 + 50,
                    speed: Math.random() * 15 + 10,
                    opacity: 1,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Stars
            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();

                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0.3) {
                    star.speed = -star.speed;
                }
            });

            // Draw and Update Shooting Stars
            createShootingStar();

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];

                s.x += s.speed;
                s.y += s.speed * 0.5;
                s.opacity -= 0.01;

                const tailX = s.x - s.length;
                const tailY = s.y - (s.length * 0.5);

                const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(100, 255, 255, ${s.opacity})`);
                gradient.addColorStop(1, 'rgba(100, 255, 255, 0)');

                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                if (s.x > canvas.width + s.length || s.y > canvas.height + s.length || s.opacity <= 0) {
                    shootingStars.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        // Initial resize
        resizeCanvas();
        draw();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ background: 'transparent' }}
        />
    );
};

export default StarBackground;
