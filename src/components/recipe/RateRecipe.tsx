import { useState, useCallback, useRef, useId } from 'react';

interface Props {
  recipeId: string;
  initialRating: number;
  initialCount: number;
}

const STAR_PATH = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

function getStarFill(starIndex: number, rating: number): 'full' | 'half' | 'empty' {
  if (rating >= starIndex) return 'full';
  if (rating >= starIndex - 0.5) return 'half';
  return 'empty';
}

/** Lightweight Canvas2D sprinkle burst — ice cream themed celebration */
function burstSprinkles(container: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:10';
  container.style.position = 'relative';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const COLORS = ['#F4B8C1', '#B8D4E3', '#F5D47A', '#A8D5BA', '#D4A8E0', '#F9C49A'];
  const particles = Array.from({ length: 24 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * -6 - 2,
    size: Math.random() * 4 + 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    life: 1,
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.rotation += 0.1;
      p.life -= 0.02;
      if (p.life <= 0) continue;
      alive = true;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2.5);
      ctx.restore();
    }
    if (alive && frame < 60) { frame++; requestAnimationFrame(animate); }
    else { canvas.remove(); }
  }
  requestAnimationFrame(animate);
}

export default function RateRecipe({ recipeId, initialRating, initialCount }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [avgRating, setAvgRating] = useState(initialRating);
  const [ratingCount, setRatingCount] = useState(initialCount);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const uniqueId = useId();

  // Check if user already rated (cookie)
  const [alreadyRated] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes(`rated_${recipeId}=`);
  });

  const submitRating = useCallback(async (rating: number) => {
    setStatus('submitting');
    setSubmittedRating(rating);

    try {
      const res = await fetch('/api/recipes/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_id: recipeId, rating, honeypot: '' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setAvgRating(data.avg_rating);
      setRatingCount(data.rating_count);
      setStatus('done');

      // Celebrate high ratings with a sprinkle burst
      if (rating >= 4 && containerRef.current) {
        burstSprinkles(containerRef.current);
      }

      // Set cookie to remember this rating (1 year)
      document.cookie = `rated_${recipeId}=${rating};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      setStatus('error');
    }
  }, [recipeId]);

  const isDone = status === 'done' || alreadyRated;
  const displayRating = isDone
    ? (submittedRating || avgRating)
    : (hoveredRating || submittedRating);

  const handleStarClick = useCallback((star: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = (e.clientX - rect.left) < rect.width / 2;
    submitRating(isLeftHalf ? star - 0.5 : star);
  }, [submitRating]);

  const handleStarHover = useCallback((star: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDone) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = (e.clientX - rect.left) < rect.width / 2;
    setHoveredRating(isLeftHalf ? star - 0.5 : star);
  }, [isDone]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3 py-6 px-4 bg-cream/50 rounded-2xl border border-slate-100">
      {/* Honeypot field — hidden from humans, visible to bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <p className="text-sm font-medium text-chocolate">
        {isDone ? 'Thanks for rating!' : 'How would you rate this recipe?'}
      </p>

      {/* Interactive stars */}
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rate this recipe">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = getStarFill(star, displayRating);
          const halfGradientId = `half-star-rate-${uniqueId}-${star}`;

          return (
            <button
              key={star}
              type="button"
              disabled={isDone || status === 'submitting'}
              onClick={(e) => handleStarClick(star, e)}
              onMouseMove={(e) => handleStarHover(star, e)}
              onMouseLeave={() => !isDone && setHoveredRating(0)}
              className={`p-1 transition-transform ${isDone ? 'cursor-default' : 'cursor-pointer hover:scale-110'} ${status === 'submitting' ? 'animate-pulse' : ''}`}
              role="radio"
              aria-checked={star === Math.ceil(submittedRating) || undefined}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              <svg className="w-8 h-8 transition-colors" viewBox="0 0 20 20">
                {fill === 'half' && (
                  <defs>
                    <linearGradient id={halfGradientId}>
                      <stop offset="50%" stopColor="#F5D47A" />
                      <stop offset="50%" stopColor="#E2E8F0" />
                    </linearGradient>
                  </defs>
                )}
                <path
                  d={STAR_PATH}
                  fill={
                    fill === 'full' ? '#F5D47A' :
                    fill === 'half' ? `url(#${halfGradientId})` :
                    '#E2E8F0'
                  }
                />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Rating preview */}
      {hoveredRating > 0 && !isDone && (
        <p className="text-xs text-slate-400">{hoveredRating} star{hoveredRating !== 1 ? 's' : ''}</p>
      )}

      {/* Rating info */}
      <p className="text-xs text-slate-500">
        {ratingCount > 0
          ? `${avgRating.toFixed(1)} average from ${ratingCount} rating${ratingCount !== 1 ? 's' : ''}`
          : 'Be the first to rate!'}
      </p>

      {status === 'error' && (
        <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
