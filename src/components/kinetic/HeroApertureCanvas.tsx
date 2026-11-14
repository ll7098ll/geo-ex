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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;

    const setupSize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setupSize();

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let angle = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Hairline Crosshair Guides
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mouseY);
      ctx.lineTo(width, mouseY);
      ctx.moveTo(mouseX, 0);
      ctx.lineTo(mouseX, height);
      ctx.stroke();

      // 2. Concentric NatGeo Yellow & Warm White Aperture Rings
      const rings = [60, 110, 170, 240];
      rings.forEach((radius, i) => {
        ctx.save();
        ctx.translate(mouseX, mouseY);
        ctx.rotate(angle * (i % 2 === 0 ? 1 : -1) * (0.7 + i * 0.15));

        ctx.strokeStyle =
          i === 1
            ? 'rgba(255, 204, 0, 0.36)'
            : 'rgba(255, 204, 0, 0.14)';
        ctx.lineWidth = i === 1 ? 1.25 : 1;
        ctx.setLineDash(i % 2 === 0 ? [4, 7] : [2, 5]);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Radial Tick Marks on the 2nd ring
        if (i === 1) {
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
          for (let deg = 0; deg < 360; deg += 30) {
            const rad = (deg * Math.PI) / 180;
            const x1 = Math.cos(rad) * (radius - 4);
            const y1 = Math.sin(rad) * (radius - 4);
            const x2 = Math.cos(rad) * (radius + 4);
            const y2 = Math.sin(rad) * (radius + 4);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
        ctx.restore();
      });

      // 3. Central Target Crosshair (NatGeo Yellow)
      ctx.strokeStyle = 'rgba(255, 204, 0, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mouseX - 7, mouseY);
      ctx.lineTo(mouseX + 7, mouseY);
      ctx.moveTo(mouseX, mouseY - 7);
      ctx.lineTo(mouseX, mouseY + 7);
      ctx.stroke();
    };

    if (!isActive || prefersReducedMotion) {
      drawFrame();
      return;
    }

    const handleResize = () => {
      if (!canvas.parentElement) return;
      setupSize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      mouseX += (targetX - mouseX) * 0.085;
      mouseY += (targetY - mouseY) * 0.085;
      angle += 0.004;

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
