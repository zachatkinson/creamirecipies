import { useState, useEffect } from 'react';

interface Model {
  slug: string;
  name: string;
  pint_size_oz: number;
}

interface Props {
  models: Model[];
  recipePintSize: '16oz' | '24oz';
  isSwirl: boolean;
  onScaleChange: (scale: number) => void;
}

const COOKIE_KEY = 'user_creami_model';

export default function ModelSelector({ models, recipePintSize, isSwirl, onScaleChange }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string>('');

  useEffect(() => {
    const saved = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${COOKIE_KEY}=`))
      ?.split('=')[1];

    if (saved && models.some((m) => m.slug === saved)) {
      setSelectedSlug(saved);
      applyScale(saved);
    }
  }, []);

  function applyScale(slug: string) {
    const model = models.find((m) => m.slug === slug);
    if (!model) return;
    const recipeSizeOz = recipePintSize === '24oz' ? 24 : 16;
    onScaleChange(model.pint_size_oz / recipeSizeOz);
  }

  function handleChange(slug: string) {
    setSelectedSlug(slug);
    document.cookie = `${COOKIE_KEY}=${slug}; path=/; max-age=${60 * 60 * 24 * 365}`;
    applyScale(slug);
  }

  const selected = models.find((m) => m.slug === selectedSlug);
  const recipeSizeOz = recipePintSize === '24oz' ? 24 : 16;
  const isScaled = selected && selected.pint_size_oz !== recipeSizeOz;
  const swirlWarning = isSwirl && selectedSlug !== '' && selectedSlug !== 'swirl';

  return (
    <div className="mb-5">
      {/* Big prominent dropdown */}
      <label htmlFor="model-select" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
        Your Creami Model
      </label>
      <select
        id="model-select"
        value={selectedSlug}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-3 text-sm font-medium rounded-xl border-2 border-[#F4B8C1] bg-white text-[#5C3D2E] focus:border-[#8B3A62] focus:ring-2 focus:ring-[#8B3A62]/20 outline-none cursor-pointer"
        aria-label="Select your Ninja Creami model"
      >
        <option value="">Select your model...</option>
        {models.map((model) => (
          <option key={model.slug} value={model.slug}>
            {model.name} ({model.pint_size_oz}oz pint)
          </option>
        ))}
      </select>

      {/* Model image */}
      {selected && (
        <img
          src={`/images/models/${selected.slug}.avif`}
          alt={selected.name}
          className="mt-3 w-16 h-16 object-contain hidden"
          onLoad={(e) => { (e.target as HTMLImageElement).classList.remove('hidden'); }}
          onError={(e) => { (e.target as HTMLImageElement).classList.add('hidden'); }}
        />
      )}

      {/* Swirl warning */}
      {swirlWarning && (
        <div className="mt-3 p-3 bg-[#FDE9B0]/30 border border-[#FDE9B0] rounded-xl text-sm">
          <strong className="text-[#5C3D2E]">Scoop & Swirl Required</strong>
          <p className="text-slate-600 mt-1">
            This recipe uses the swirl dispensing feature, exclusive to the Ninja CREAMi Scoop & Swirl.
          </p>
        </div>
      )}

      {/* Scale indicator */}
      {isScaled && !swirlWarning && (
        <div className="mt-2 text-xs text-[#1a6b4f] bg-[#A8D8C8]/20 px-3 py-2 rounded-lg">
          {selected!.pint_size_oz < recipeSizeOz
            ? `Ingredients scaled down to ${selected!.pint_size_oz}oz for your model.`
            : `Ingredients scaled up to ${selected!.pint_size_oz}oz for your model.`
          }
        </div>
      )}
    </div>
  );
}
