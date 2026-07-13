"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SparklesProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
  speed?: number;
}

export const SparklesCore: React.FC<SparklesProps> = ({
  id,
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 30,
  className,
  particleColor = "#8b5cf6",
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.clientWidth || canvas.offsetWidth || 300;
    let height = canvas.clientHeight || canvas.offsetHeight || 150;

    const resizeCanvas = () => {
      if (!canvas) return;
      width = canvas.clientWidth || canvas.offsetWidth || 300;
      height = canvas.clientHeight || canvas.offsetHeight || 150;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    // Create particles based on density
    const calculatedDensity = particleDensity || 30;
    const particleCount = Math.max(15, Math.floor((width * height * calculatedDensity) / 80000));
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
    }

    const particles: Particle[] = [];

    const createParticle = (init = false): Particle => {
      return {
        x: Math.random() * width,
        y: init ? Math.random() * height : height + 10,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * 0.4 * speed,
        speedY: -(Math.random() * 0.4 + 0.1) * speed,
        opacity: Math.random(),
        fadeSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 1) {
          p.opacity = 1;
          p.fadeSpeed = -Math.abs(p.fadeSpeed);
        } else if (p.opacity < 0) {
          p.opacity = 0;
          p.fadeSpeed = Math.abs(p.fadeSpeed);
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Recycle particles if they go offscreen
        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles[idx] = createParticle(false);
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [maxSize, minSize, particleColor, particleDensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      style={{ background }}
      className={cn("w-full h-full block", className)}
    />
  );
};
