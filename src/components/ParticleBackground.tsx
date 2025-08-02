import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 80,
  connectionDistance = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const isMouseDownRef = useRef(false);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        hue: 217 + Math.random() * 40, // Blue to purple range
      });
    }
    particlesRef.current = particles;
  }, [particleCount]);

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${particle.hue}, 91%, 60%, ${particle.opacity})`;
    ctx.fill();
    
    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsla(${particle.hue}, 91%, 60%, 0.5)`;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const drawConnection = (
    ctx: CanvasRenderingContext2D,
    p1: Particle,
    p2: Particle,
    distance: number
  ) => {
    const opacity = 1 - distance / connectionDistance;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `hsla(217, 91%, 60%, ${opacity * 0.3})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const isMouseDown = isMouseDownRef.current;

    particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse interaction - particles move away from mouse
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        // Move particles away from mouse (negative force)
        particle.vx -= (dx / distance) * force * 0.05;
        particle.vy -= (dy / distance) * force * 0.05;
        
        // Add extra repulsion when mouse is down
        if (isMouseDown) {
          particle.vx -= (dx / distance) * force * 0.1;
          particle.vy -= (dy / distance) * force * 0.1;
        }
      }

      // Add some randomness to movement
      particle.vx += (Math.random() - 0.5) * 0.01;
      particle.vy += (Math.random() - 0.5) * 0.01;

      // Limit velocity
      const maxVelocity = 2;
      particle.vx = Math.max(-maxVelocity, Math.min(maxVelocity, particle.vx));
      particle.vy = Math.max(-maxVelocity, Math.min(maxVelocity, particle.vy));

      // Boundary checks with bounce
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }

      // Draw particle
      drawParticle(ctx, particle);

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const otherParticle = particles[j];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          drawConnection(ctx, particle, otherParticle, distance);
        }
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [connectionDistance]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback(() => {
    isMouseDownRef.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    isMouseDownRef.current = true;
    const touch = event.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    isMouseDownRef.current = false;
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, handleMouseMove, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleBackground;
