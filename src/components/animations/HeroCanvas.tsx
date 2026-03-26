import { useEffect, useRef, useState } from 'react';
import { Application, Container, Graphics } from 'pixi.js';

const COLORS = [0xf4b8c1, 0xa8d8c8, 0xc4b1d4, 0xfde9b0, 0xfff8f0];

interface Particle {
  graphic: Graphics;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'rect';
  size: number;
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (isMobile) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;

    const mousePos = { x: -9999, y: -9999 };
    const REPEL_RADIUS = 100;
    const REPEL_STRENGTH = 2;

    async function init() {
      const app = new Application();
      await app.init({
        resizeTo: container!,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      container!.appendChild(app.canvas as HTMLCanvasElement);

      const particleContainer = new Container();
      app.stage.addChild(particleContainer);

      const width = app.screen.width;
      const height = app.screen.height;
      const particleCount = Math.min(60, Math.max(40, Math.floor((width * height) / 15000)));

      const particles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const shape = Math.random() > 0.4 ? 'rect' : 'circle';
        const size = randomRange(3, 8);

        const g = new Graphics();
        if (shape === 'circle') {
          g.circle(0, 0, size);
          g.fill({ color, alpha: randomRange(0.4, 0.8) });
        } else {
          // Sprinkle rectangle
          g.roundRect(-size * 1.5, -size * 0.4, size * 3, size * 0.8, size * 0.3);
          g.fill({ color, alpha: randomRange(0.4, 0.8) });
        }

        const x = randomRange(0, width);
        const y = randomRange(0, height);
        g.x = x;
        g.y = y;
        g.rotation = randomRange(0, Math.PI * 2);

        particleContainer.addChild(g);

        particles.push({
          graphic: g,
          x,
          y,
          vx: randomRange(-0.3, 0.3),
          vy: randomRange(-0.4, -0.15),
          rotation: g.rotation,
          rotationSpeed: randomRange(-0.01, 0.01),
          shape,
          size,
        });
      }

      // If reduced motion, show static particles, no animation
      if (prefersReducedMotion) return;

      // Mouse tracking — listen on document since parent has pointer-events-none
      const onMouseMove = (e: MouseEvent) => {
        const rect = (app.canvas as HTMLCanvasElement).getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        // Only track if mouse is within canvas bounds
        if (mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
          mousePos.x = mx;
          mousePos.y = my;
        } else {
          mousePos.x = -9999;
          mousePos.y = -9999;
        }
      };

      document.addEventListener('mousemove', onMouseMove);

      app.ticker.add(() => {
        const w = app.screen.width;
        const h = app.screen.height;

        for (const p of particles) {
          // Base movement
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          // Mouse repulsion
          const dx = p.x - mousePos.x;
          const dy = p.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }

          // Wrap around edges
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;

          p.graphic.x = p.x;
          p.graphic.y = p.y;
          p.graphic.rotation = p.rotation;
        }
      });

      // Cleanup mouse listeners on destroy
      const cleanup = () => {
        document.removeEventListener('mousemove', onMouseMove);
      };

      cleanupRef.current = cleanup;
    }

    init();

    return () => {
      destroyed = true;
      const app = appRef.current;
      if (app) {
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
        app.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);

  // Don't render anything on mobile
  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  );
}
