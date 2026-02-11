// components/InteractiveBackground.tsx
"use client";

import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -1.5 - 0.5; // Bergerak ke atas
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX + (mouse.x / 100);
        this.y += this.speedY;
        if (this.y < 0) {
          this.y = canvas!.height;
          this.x = Math.random() * canvas!.width;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 153, 0, ${this.opacity})`; // Amber Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FF9900";
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      
      // Draw Industrial Grid
      ctx.strokeStyle = "rgba(102, 102, 102, 0.1)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas!.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + (mouse.x / 50), 0);
        ctx.lineTo(x + (mouse.x / 50), canvas!.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas!.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + (mouse.y / 50));
        ctx.lineTo(canvas!.width, y + (mouse.y / 50));
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX - window.innerWidth / 2;
      mouse.y = e.clientY - window.innerHeight / 2;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-[#151515] pointer-events-none"
    />
  );
}
// EOF