import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface BlueprintLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  direction: 'horizontal' | 'vertical';
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [blueprintLines, setBlueprintLines] = useState<BlueprintLine[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Initialize particles and blueprint lines
  useEffect(() => {
    const initParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };

    const initBlueprintLines = () => {
      const newLines: BlueprintLine[] = [];
      const lineCount = 8;
      
      for (let i = 0; i < lineCount; i++) {
        const isHorizontal = Math.random() > 0.5;
        const line: BlueprintLine = {
          id: i,
          x1: isHorizontal ? 0 : Math.random() * window.innerWidth,
          y1: isHorizontal ? Math.random() * window.innerHeight : 0,
          x2: isHorizontal ? window.innerWidth : Math.random() * window.innerWidth,
          y2: isHorizontal ? Math.random() * window.innerHeight : window.innerHeight,
          progress: 0,
          direction: isHorizontal ? 'horizontal' : 'vertical'
        };
        newLines.push(line);
      }
      setBlueprintLines(newLines);
    };

    initParticles();
    initBlueprintLines();

    const handleResize = () => {
      initParticles();
      initBlueprintLines();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse movement handler
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Animate particles
  useEffect(() => {
    let animationId: number;

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        // Bounce off edges
        if (newX <= 0 || newX >= window.innerWidth) {
          particle.vx *= -1;
          newX = particle.x + particle.vx;
        }
        if (newY <= 0 || newY >= window.innerHeight) {
          particle.vy *= -1;
          newY = particle.y + particle.vy;
        }

        return {
          ...particle,
          x: newX,
          y: newY
        };
      }));

      animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Animate blueprint lines
  useEffect(() => {
    const interval = setInterval(() => {
      setBlueprintLines(prev => prev.map(line => ({
        ...line,
        progress: line.progress >= 1 ? 0 : line.progress + 0.005
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: 'none' }}
    >
      {/* Subtle gradient overlays for color */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/2"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/2 via-transparent to-primary/2"></div>
      
      {/* Colored background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/8 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary/6 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-accent/4 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Moving Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary rounded-full interactive-bg-particle"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Animated Blueprint Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {blueprintLines.map(line => (
          <motion.line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.direction === 'horizontal' 
              ? line.x1 + (line.x2 - line.x1) * line.progress 
              : line.x2
            }
            y2={line.direction === 'vertical' 
              ? line.y1 + (line.y2 - line.y1) * line.progress 
              : line.y2
            }
            stroke="rgba(10, 61, 98, 0.2)"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity={0.6}
          />
        ))}
        
        {/* Mouse-responsive circle */}
        <motion.circle
          cx={smoothMouseX}
          cy={smoothMouseY}
          r="80"
          fill="none"
          stroke="rgba(10, 61, 98, 0.1)"
          strokeWidth="1"
          strokeDasharray="2,8"
          opacity={0.8}
          style={{
            filter: 'blur(0.5px)'
          }}
        />
        
        {/* Secondary mouse circle */}
        <motion.circle
          cx={smoothMouseX}
          cy={smoothMouseY}
          r="120"
          fill="none"
          stroke="rgba(184, 115, 51, 0.08)"
          strokeWidth="1"
          strokeDasharray="1,12"
          opacity={0.6}
        />
      </svg>

      {/* Floating Blueprint Elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/10 border-dashed rounded-lg"
        animate={{
          rotate: [0, 2, 0, -2, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/3 w-24 h-24 border border-accent/10 border-dashed rounded-full"
        animate={{
          rotate: [0, -3, 0, 3, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-20 h-20"
        animate={{
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-1/2 w-px h-full bg-primary/10 transform -translate-x-1/2"></div>
          <div className="absolute left-0 top-1/2 w-full h-px bg-primary/10 transform -translate-y-1/2"></div>
        </div>
      </motion.div>

      {/* Additional Architectural Elements */}
      <motion.div
        className="absolute top-16 right-16 w-16 h-16 border-2 border-secondary/15"
        style={{
          borderRadius: '0 100% 0 100%'
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div
        className="absolute bottom-32 left-16 w-28 h-28"
        animate={{
          rotate: [0, -1, 0, 1, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full relative border border-accent/8 rounded-lg">
          <div className="absolute top-2 left-2 right-2 bottom-2 border border-accent/8 rounded-md"></div>
          <div className="absolute top-4 left-4 right-4 bottom-4 border border-accent/8 rounded-sm"></div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/3 left-16 w-6 h-40 bg-gradient-to-b from-primary/5 to-transparent"
        animate={{
          scaleY: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-20 w-40 h-6 bg-gradient-to-r from-secondary/5 to-transparent"
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Architectural compass rose */}
      <motion.div
        className="absolute top-20 left-1/3 w-12 h-12"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-primary/15 transform -translate-x-1/2"></div>
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-primary/15 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-accent/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-accent/10 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
        </div>
      </motion.div>

      {/* Additional colored geometric elements */}
      <motion.div
        className="absolute top-32 right-1/4 w-20 h-2 bg-gradient-to-r from-secondary/20 to-accent/15"
        animate={{
          scaleX: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-40 right-32 w-2 h-24 bg-gradient-to-b from-primary/15 to-secondary/10"
        animate={{
          scaleY: [1, 1.4, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-2/3 left-32 w-16 h-16 rounded-full border-2 border-accent/20"
        animate={{
          scale: [1, 1.1, 1],
          borderColor: ["rgba(184, 115, 51, 0.2)", "rgba(76, 175, 80, 0.15)", "rgba(184, 115, 51, 0.2)"],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-40 left-2/3 w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/8 transform rotate-45"
        animate={{
          rotate: [45, 135, 45],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-accent/6 to-transparent"></div>
      
      {/* Subtle accent lines */}
      <motion.div
        className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/12 to-transparent"
        animate={{
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-background/10"></div>
    </div>
  );
}