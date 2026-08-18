import { Scene } from '../data';

interface Props { scene: Scene | null; }

// Deterministic helpers — no Math.random() in render
function det(i: number, mod: number, offset = 0) {
  return ((i * 17 + offset) % mod);
}

function SalonAmbient() {
  const hairs = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${det(i, 100, 5)}%`,
    delay: `${(det(i, 60, 2) / 10).toFixed(1)}s`,
    duration: `${(3 + det(i, 40, 7) / 10).toFixed(1)}s`,
    height: `${8 + det(i, 20, 3)}px`,
  }));

  return (
    <>
      <div className="tube-light" />
      <div className="light-ray ray-1" />
      <div className="light-ray ray-2" />
      <div className="light-ray ray-3" />
      {hairs.map(h => (
        <div key={h.id} className="hair-particle" style={{
          left: h.left,
          animationDelay: h.delay,
          animationDuration: h.duration,
          height: h.height,
        }} />
      ))}
    </>
  );
}

function ChaiAmbient() {
  const drops = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    left: `${det(i, 100, 3)}%`,
    delay: `${(det(i, 20, 1) / 10).toFixed(1)}s`,
    duration: `${(0.7 + det(i, 8, 2) / 10).toFixed(2)}s`,
    height: `${15 + det(i, 20, 4)}px`,
    opacity: (0.2 + det(i, 30, 0) / 100).toFixed(2),
  }));

  return (
    <>
      {drops.map(d => (
        <div key={d.id} className="rain-drop" style={{
          left: d.left,
          animationDelay: d.delay,
          animationDuration: d.duration,
          height: d.height,
          opacity: Number(d.opacity),
        }} />
      ))}
      <div className="steam steam-1" style={{ animationDuration: '3s' }} />
      <div className="steam steam-2" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
      <div className="steam steam-3" style={{ animationDuration: '3.5s', animationDelay: '2s' }} />
    </>
  );
}

function RailwayAmbient() {
  return (
    <>
      <div className="steam-puff steam-puff-1" />
      <div className="steam-puff steam-puff-2" />
      <div className="steam-puff steam-puff-3" />
      <div className="platform-light pl-1" />
      <div className="platform-light pl-2" />
      <div className="platform-light pl-3" />
    </>
  );
}

function BusAmbient() {
  const stripes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    top: `${15 + i * 12}%`,
    delay: `${(i * 0.5).toFixed(1)}s`,
  }));

  return (
    <>
      {stripes.map(s => (
        <div key={s.id} className="road-stripe" style={{
          top: s.top,
          animationDelay: s.delay,
        }} />
      ))}
      <div className="bus-dust bd-1" />
      <div className="bus-dust bd-2" />
    </>
  );
}

function MohallaAmbient() {
  return (
    <>
      <div className="golden-light gl-1" />
      <div className="golden-light gl-2" />
    </>
  );
}

function RadioAmbient() {
  return (
    <>
      <div className="radio-wave radio-wave-1" />
      <div className="radio-wave radio-wave-2" />
      <div className="radio-wave radio-wave-3" />
      <div className="radio-glow" />
    </>
  );
}

export default function SceneBackground({ scene }: Props) {
  if (!scene) return null;

  const ambientMap: Record<string, React.ReactNode> = {
    'desi-salon': <SalonAmbient />,
    'chai-tapri': <ChaiAmbient />,
    'railway-station': <RailwayAmbient />,
    'bus-ka-safar': <BusAmbient />,
    'mohalle-ki-shaam': <MohallaAmbient />,
    'purana-radio': <RadioAmbient />,
  };

  return (
    <div className={`scene-ambient scene-${scene.id}`} aria-hidden="true">
      {ambientMap[scene.id]}
    </div>
  );
}
