import { CloudRain, Moon, Sunset, Sun } from 'lucide-react';

export type WeatherMode = 'day' | 'sunset' | 'night' | 'rain';

interface WeatherOverlayProps {
  mode: WeatherMode;
  onModeChange: (mode: WeatherMode) => void;
}

export default function WeatherOverlay({ mode, onModeChange }: WeatherOverlayProps) {
  return (
    <>
      {/* Visual Canvas Overlay Effects */}
      <div className={`weather-layer weather-mode-${mode}`}>
        {mode === 'rain' && (
          <div className="rain-glass-overlay">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="rain-drop"
                style={{
                  left: `${(i * 13.7) % 100}%`,
                  animationDelay: `${(i * 0.2) % 2.5}s`,
                  animationDuration: `${0.8 + (i % 5) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
        {mode === 'night' && (
          <div className="night-stars-overlay">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${(i * 17) % 100}%`,
                  top: `${(i * 11) % 80}%`,
                  animationDelay: `${(i * 0.3) % 3}s`,
                }}
              />
            ))}
          </div>
        )}
        {mode === 'sunset' && <div className="sunset-gradient-overlay" />}
      </div>

      {/* Weather Control Links matching Navbar style */}
      <div className="weather-nav-group">
        <button
          className={`nav-weather-link ${mode === 'day' ? 'active' : ''}`}
          onClick={() => onModeChange('day')}
          title="Daylight Sunshine"
        >
          <Sun size={13} /> <span>DAY</span>
        </button>
        <button
          className={`nav-weather-link ${mode === 'sunset' ? 'active' : ''}`}
          onClick={() => onModeChange('sunset')}
          title="Sunset Hour"
        >
          <Sunset size={13} /> <span>SUNSET</span>
        </button>
        <button
          className={`nav-weather-link ${mode === 'night' ? 'active' : ''}`}
          onClick={() => onModeChange('night')}
          title="Moonlight Night"
        >
          <Moon size={13} /> <span>NIGHT</span>
        </button>
        <button
          className={`nav-weather-link ${mode === 'rain' ? 'active' : ''}`}
          onClick={() => onModeChange('rain')}
          title="Rainy Glass Atmosphere"
        >
          <CloudRain size={13} /> <span>RAIN</span>
        </button>
      </div>
    </>
  );
}
