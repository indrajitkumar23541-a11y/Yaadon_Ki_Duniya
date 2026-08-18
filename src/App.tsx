import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowDown, ArrowRight, ChevronRight, Heart, Menu, Sparkles, X, Mail } from 'lucide-react';
import { scenes, Scene } from './data';
import Player from './components/Player';
import SceneBackground from './components/SceneBackground';
import RadioTuner from './components/RadioTuner';
import WeatherOverlay, { WeatherMode } from './components/WeatherOverlay';
import SoundBoard from './components/SoundBoard';
import MoodFilter, { MoodType } from './components/MoodFilter';
import PostcardModal from './components/PostcardModal';
import './styles.css';

export default function App() {
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('sunset');
  const [currentMood, setCurrentMood] = useState<MoodType>('all');
  const [showPostcard, setShowPostcard] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Stable particles — deterministic, no re-random on every render
  const particles = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${(i * 19 + 7) % 100}%`,
      delay: `${((i * 1.3) % 8).toFixed(1)}s`,
      duration: `${(7 + (i * 1.1) % 9).toFixed(1)}s`,
      size: `${(1.5 + (i * 0.55) % 2.5).toFixed(1)}px`,
    })),
  []);

  useEffect(() => {
    // Cinematic page-load fade-in
    const t = setTimeout(() => setLoaded(true), 150);

    // Scroll-reveal with IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    const revealTimer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 400);

    return () => { clearTimeout(t); clearTimeout(revealTimer); observer.disconnect(); };
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;
    const rx = ((y - cy) / cy) * -13;
    const ry = ((x - cx) / cx) * 13;
    card.style.transition = 'box-shadow 0.08s, border-color 0.2s';
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-12px) scale(1.03)`;
    card.style.boxShadow = `${ry * 1.2}px ${-rx * 1.2}px 35px rgba(0,0,0,0.45), 0 25px 45px rgba(0,0,0,0.35)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    card.style.transform = '';
    card.style.boxShadow = '';
  };

  // Filter scenes based on selected Mood
  const filteredScenes = useMemo(() => {
    if (currentMood === 'all') return scenes;
    return scenes;
  }, [currentMood]);

  return (
    <>
      {/* ── Cinematic black fade-in intro ── */}
      <div className={`cinematic-intro${loaded ? ' intro-done' : ''}`} />

      {/* ── SVG Film Grain overlay ── */}
      <svg className="film-grain-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>

      {/* ── Floating golden dust particles ── */}
      <div className="particles-container" aria-hidden="true">
        {particles.map(p => (
          <div key={p.id} className="particle" style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }} />
        ))}
      </div>

      {/* ── Scene-specific ambient background ── */}
      <SceneBackground scene={currentScene} />

      <main className={currentScene ? 'has-player' : ''}>
        {/* ── Navigation ── */}
        <nav className="nav shell">
          <a className="brand" href="#home" aria-label="Yaadon Ki Duniya home">
            <span className="brand-mark">Y</span>
            <span><b>Yaadon Ki</b><em>Duniya</em></span>
          </a>

          <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a href="#anubhav" onClick={() => setMenuOpen(false)}>Anubhav</a>
            <a href="#tuner" onClick={() => setMenuOpen(false)}>Radio Tuner</a>
            <a href="#kaise" onClick={() => setMenuOpen(false)}>Kaise Kaam Karta Hai</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>Humare Baare Mein</a>

            <span className="nav-divider" aria-hidden="true">|</span>
            <WeatherOverlay mode={weatherMode} onModeChange={setWeatherMode} />
          </div>
          <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* ── Hero ── */}
        <section
          id="home"
          className={`hero cinematic-hero${loaded ? ' hero-loaded' : ''}`}
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        >
          <div className="cinematic-bg">
            <img
              className="cinematic-video-layer"
              src="./images/hero.jpg"
              alt="Yaadon Ki Duniya - Purana Bharat"
              style={{ transform: `scale(1.12) translate(${mousePos.x * -22}px, ${mousePos.y * -15}px)` }}
            />
            <div className="cinematic-overlay" />
            <div className="cinematic-vignette" />
          </div>

          <div className="hero-content shell">
            <div className="hero-copy">
              <div className="eyebrow hero-anim" style={{ animationDelay: '0.3s' }}>
                <span></span> EK NOSTALGIC SAFAR
              </div>
              <h1 className="hero-anim" style={{ animationDelay: '0.55s' }}>
                Woh lamhe,<br /><i>phir se</i> jeeyein.
              </h1>
              <p className="hindi-title hero-anim" style={{ animationDelay: '0.75s' }}>
                जहाँ यादें अभी भी बजती हैं
              </p>
              <p className="intro hero-anim" style={{ animationDelay: '0.95s' }}>
                Purane Bharat ki woh khushboo, woh awaazein aur woh gaane—jo humein ek pal mein ghar le jaate hain.
              </p>
              <div className="hero-actions hero-anim" style={{ animationDelay: '1.15s' }}>
                <a href="#anubhav" className="primary">Apna anubhav chuniye <ArrowDown size={17} /></a>
                <button className="postcard-trigger-btn" onClick={() => setShowPostcard(true)}>
                  <Mail size={16} /> <span>90s Chitthi / Postcard Share</span>
                </button>
              </div>
            </div>
          </div>

          <div className="scroll-indicator" aria-hidden="true">
            <div className="scroll-line" />
          </div>
        </section>

        {/* ── Feature 1: Vintage Radio Tuner ── */}
        <section id="tuner" className="tuner-section shell reveal">
          <RadioTuner currentScene={currentScene} onSelectScene={setCurrentScene} />
        </section>

        {/* ── Feature 6: Mood & Emotion Filter ── */}
        <section className="mood-section shell reveal">
          <MoodFilter currentMood={currentMood} onSelectMood={setCurrentMood} />
        </section>

        {/* ── Experiences Cards ── */}
        <section id="anubhav" className="experiences">
          <div className="shell">
            <div className="section-heading reveal">
              <div>
                <div className="eyebrow"><span></span> APNA MANPASAND CHUNIYE</div>
                <h2>Kaunsa <i>ehsaas</i><br />yaad aata hai?</h2>
              </div>
              <p>Har jagah ki apni ek dhun hai.<br />Bas aankhein band kijiye aur suniye.</p>
            </div>

            <div className="cards">
              {filteredScenes.map((s, index) => (
                <button
                  className={`experience-card ${s.tint}${currentScene?.id === s.id ? ' selected' : ''} reveal`}
                  key={s.id}
                  onClick={() => setCurrentScene(s)}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <img src={s.image} alt="" />
                  <div className="card-overlay" />
                  <div className="card-shimmer" />
                  <div className="card-number">0{index + 1}</div>
                  <div className="card-icon">{s.icon}</div>
                  <div className="card-copy">
                    <span>{s.hindi}</span>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                  <ChevronRight className="card-arrow" size={20} />
                  {currentScene?.id === s.id && (
                    <div className="card-playing-badge">▶ Ab Baj Raha Hai</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature 3: Desi Sound Board ── */}
        <section className="soundboard-section shell reveal">
          <SoundBoard />
        </section>

        {/* ── How It Works ── */}
        <section id="kaise" className="how shell">
          <div className="how-art how-photo reveal">
            <img src="./images/yaadon-section.png" alt="Vintage cassette player with old family memories" />
          </div>
          <div className="how-copy reveal">
            <div className="eyebrow"><span></span> BAS TEEN KADAM</div>
            <h2>Yaadon mein<br /><i>lautna</i> aasaan hai.</h2>
            <ol>
              <li><b>01</b><span>Apna pasandida <strong>anubhav chuniye</strong></span></li>
              <li><b>02</b><span>Headphones lagaiye aur <strong>awaazon ko mehsoos kijiye</strong></span></li>
              <li><b>03</b><span>Aankhein band karke <strong>us pal mein kho jaiye</strong></span></li>
            </ol>
          </div>
        </section>

        {/* ── Quote ── */}
        <section id="about" className="quote">
          <Sparkles size={21} />
          <blockquote className="reveal">
            "Kuch gaane sirf sune nahi jaate,<br /><i>mehsoos kiye jaate hain.</i>"
          </blockquote>
          <p>— Yaadon Ki Duniya</p>
        </section>

        {/* ── Footer ── */}
        <footer className="footer shell">
          <a className="brand" href="#home">
            <span className="brand-mark">Y</span>
            <span><b>Yaadon Ki</b><em>Duniya</em></span>
          </a>
          <p>Purane din. Purane gaane. Wahi ehsaas.</p>
          <span>Made with <Heart size={13} fill="currentColor" /> in India</span>
        </footer>
      </main>

      {/* Player Component */}
      <Player scene={currentScene} />

      {/* Feature 5: 90s Postcard Share Modal */}
      {showPostcard && (
        <PostcardModal
          song={currentScene?.playlist[0] || null}
          scene={currentScene}
          onClose={() => setShowPostcard(false)}
        />
      )}
    </>
  );
}
