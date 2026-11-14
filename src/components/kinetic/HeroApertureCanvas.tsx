import React, { useEffect, useRef } from 'react';

interface HeroApertureCanvasProps {
  isActive?: boolean;
}

export const HeroApertureCanvas: React.FC<HeroApertureCanvasProps> = ({ isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let angle = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Crosshair Lines across whole screen through target
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mouseY);
      ctx.lineTo(width, mouseY);
      ctx.moveTo(mouseX, 0);
      ctx.lineTo(mouseX, height);
      ctx.stroke();

      // 2. Concentric Aperture Rings around mouse focus
      const rings = [60, 110, 170, 240];
      rings.forEach((radius, i) => {
        ctx.save();
        ctx.translate(mouseX, mouseY);
        ctx.rotate(angle * (i % 2 === 0 ? 1 : -1) * (0.8 + i * 0.2));

        ctx.strokeStyle =
          i === 1
            ? 'rgba(31, 52, 255, 0.35)' // Cobalt accent ring
            : 'rgba(255, 204, 0, 0.2)'; // Gold ring
        ctx.lineWidth = 1;
        ctx.setLineDash(i % 2 === 0 ? [4, 6] : [1, 4]);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Radial Tick Marks on the 2nd ring
        if (i === 1) {
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          for (let deg = 0; deg < 360; deg += 30) {
            const rad = (deg * Math.PI) / 180;
            const x1 = Math.cos(rad) * (radius - 5);
            const y1 = Math.sin(rad) * (radius - 5);
            const x2 = Math.cos(rad) * (radius + 5);
            const y2 = Math.sin(rad) * (radius + 5);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
        ctx.restore();
      });

      // 3. Central Target Crosshair
      ctx.strokeStyle = '#FFCC00';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mouseX - 8, mouseY);
      ctx.lineTo(mouseX + 8, mouseY);
      ctx.moveTo(mouseX, mouseY - 8);
      ctx.lineTo(mouseX, mouseY + 8);
      ctx.stroke();

      // 4. Technical Telemetry Text beside target
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(
        `[ APERTURE : F/2.8 · AZ : ${Math.floor((angle * 50) % 360)}° ]`,
        mouseX + 24,
        mouseY - 18
      );
      ctx.fillStyle = 'rgba(150, 208, 255, 0.7)';
      ctx.fillText(
        `[ TARGET // X:${Math.round(mouseX)} Y:${Math.round(mouseY)} ]`,
        mouseX + 24,
        mouseY - 4
      );
    };

    if (!isActive || prefersReducedMotion) {
      drawFrame();
      return;
    }

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;
      angle += 0.005;

      drawFrame();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
};
