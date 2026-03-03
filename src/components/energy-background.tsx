"use client";

import React, { useEffect, useRef } from 'react';
import { THEME } from '@/lib/constants';

const EnergyBackground = ({ activeColor }: { activeColor: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let particleCount = 60;
    let linkDistance = 100;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

      const isMobile = window.innerWidth < 768;
      const reducedMotion = reducedMotionQuery.matches;
      particleCount = reducedMotion ? 16 : isMobile ? 28 : 60;
      linkDistance = reducedMotion ? 55 : isMobile ? 72 : 100;
      init();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        if(!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
      }
      update() {
        if(!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        this.opacity += (Math.random() - 0.5) * 0.02;
        if (this.opacity < 0.1) this.opacity = 0.1;
        if (this.opacity > 0.6) this.opacity = 0.6;
      }
      draw() {
        if(!ctx) return;
        ctx.fillStyle = activeColor || THEME.green;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    };

    window.addEventListener('resize', resize);
    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', resize);
    } else {
      reducedMotionQuery.addListener(resize);
    }
    resize();
    
    const animate = () => {
      if(!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = activeColor || THEME.green;
      ctx.lineWidth = 0.35;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < linkDistance) {
            ctx.globalAlpha = (linkDistance - distance) / (linkDistance * 16);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (typeof reducedMotionQuery.removeEventListener === 'function') {
        reducedMotionQuery.removeEventListener('change', resize);
      } else {
        reducedMotionQuery.removeListener(resize);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeColor]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default EnergyBackground;
