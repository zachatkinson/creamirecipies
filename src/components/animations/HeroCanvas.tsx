import { useEffect, useRef, useState } from 'react';
import { Application, Container, Graphics } from 'pixi.js';

// Ice cream pastel palette
const COLORS = [0xf4b8c1, 0xa8d8c8, 0xc4b1d4, 0xfde9b0, 0xfff8f0, 0xe8909e, 0x7cc0aa];

interface Particle {
  graphic: Graphics;
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'sprinkle' | 'star' | 'dot';
  size: number;
  baseAlpha: number;
  phase: number; // for sine wave motion
  phaseSpeed: number;
  pulsePhase: number;
  pulseSpeed: number;
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function drawStar(g: Graphics, size: number, color: number, alpha: number) {
  const points = 5;
  const outerRadius = size;
  const innerRadius = size * 0.4;
  const coords: number[] = [];
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    coords.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  g.poly(coords);
  g.fill({ color, alpha });
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
    const REPEL_RADIUS = 120;
    const REPEL_STRENGTH = 1.5;

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
      const particleCount = Math.min(55, Math.max(35, Math.floor((width * height) / 18000)));

      const particles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const shapeRand = Math.random();
        const shape: Particle['shape'] = shapeRand > 0.65 ? 'sprinkle' : shapeRand > 0.35 ? 'circle' : shapeRand > 0.15 ? 'dot' : 'star';
        const size = shape === 'dot' ? randomRange(1.5, 3) : shape === 'star' ? randomRange(4, 7) : randomRange(3, 7);
        const alpha = shape === 'dot' ? randomRange(0.2, 0.5) : randomRange(0.3, 0.7);

        const g = new Graphics();
        if (shape === 'circle') {
          g.circle(0, 0, size);
          g.fill({ color, alpha });
        } else if (shape === 'sprinkle') {
          g.roundRect(-size * 1.5, -size * 0.4, size * 3, size * 0.8, size * 0.3);
          g.fill({ color, alpha });
        } else if (shape === 'star') {
          drawStar(g, size, color, alpha);
        } else {
          g.circle(0, 0, size);
          g.fill({ color, alpha });
        }

        const x = randomRange(0, width);
        const y = randomRange(0, height);
        g.x = x;
        g.y = y;
        g.rotation = randomRange(0, Math.PI * 2);
        g.alpha = 0; // Start invisible for fade-in

        particleContainer.addChild(g);

        const baseVx = randomRange(-0.2, 0.2);
        const baseVy = randomRange(-0.3, -0.08);

        particles.push({
          graphic: g,
          x, y,
          baseVx, baseVy,
          vx: baseVx, vy: baseVy,
          rotation: g.rotation,
          rotationSpeed: randomRange(-0.008, 0.008),
          shape, size, baseAlpha: alpha,
          phase: randomRange(0, Math.PI * 2),
          phaseSpeed: randomRange(0.005, 0.02),
          pulsePhase: randomRange(0, Math.PI * 2),
          pulseSpeed: randomRange(0.01, 0.03),
        });
      }

      // Fade in particles over 1.5 seconds
      let fadeInProgress = 0;
      const fadeInDuration = prefersReducedMotion ? 0.3 : 1.5;

      if (prefersReducedMotion) {
        // Just show them statically
        for (const p of particles) {
          p.graphic.alpha = p.baseAlpha;
        }
        return;
      }

      // Mouse tracking
      const onMouseMove = (e: MouseEvent) => {
        const rect = (app.canvas as HTMLCanvasElement).getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        if (mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
          mousePos.x = mx;
          mousePos.y = my;
        } else {
          mousePos.x = -9999;
          mousePos.y = -9999;
        }
      };
      document.addEventListener('mousemove', onMouseMove);

      app.ticker.add((ticker) => {
        const dt = ticker.deltaTime;
        const w = app.screen.width;
        const h = app.screen.height;

        // Fade in
        if (fadeInProgress < 1) {
          fadeInProgress = Math.min(1, fadeInProgress + (0.016 * dt) / fadeInDuration);
        }

        for (const p of particles) {
          // Sine wave floating motion
          p.phase += p.phaseSpeed * dt;
          p.pulsePhase += p.pulseSpeed * dt;

          const sineOffsetX = Math.sin(p.phase) * 0.3;
          const sineOffsetY = Math.cos(p.phase * 0.7) * 0.15;

          // Base movement with sine wave
          p.x += (p.baseVx + sineOffsetX) * dt;
          p.y += (p.baseVy + sineOffsetY) * dt;
          p.rotation += p.rotationSpeed * dt;

          // Mouse repulsion
          const dx = p.x - mousePos.x;
          const dy = p.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH * dt;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }

          // Subtle size pulsing
          const pulseFactor = 1 + Math.sin(p.pulsePhase) * 0.08;
          p.graphic.scale.set(pulseFactor);

          // Wrap around edges with margin
          const margin = 30;
          if (p.y < -margin) p.y = h + margin;
          if (p.y > h + margin) p.y = -margin;
          if (p.x < -margin) p.x = w + margin;
          if (p.x > w + margin) p.x = -margin;

          p.graphic.x = p.x;
          p.graphic.y = p.y;
          p.graphic.rotation = p.rotation;

          // Fade-in alpha
          p.graphic.alpha = p.baseAlpha * fadeInProgress;
        }
      });

      cleanupRef.current = () => {
        document.removeEventListener('mousemove', onMouseMove);
      };
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
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      aria-hidden="true"
    />
  );
}
