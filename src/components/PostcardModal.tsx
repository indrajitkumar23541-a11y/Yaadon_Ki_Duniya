import { useState } from 'react';
import { X, Send, Heart, Download, Check } from 'lucide-react';
import { Song, Scene } from '../data';

interface PostcardModalProps {
  song: Song | null;
  scene: Scene | null;
  onClose: () => void;
}

export default function PostcardModal({ song, scene, onClose }: PostcardModalProps) {
  const [senderName, setSenderName] = useState('Aapka Mitr');
  const [message, setMessage] = useState('Purane din, wahi yaadein aur har shaam radio par bajti ye pyari si dhun...');
  const [copied, setCopied] = useState(false);

  if (!song) return null;

  const handleShare = () => {
    const shareText = `📻 Yaadon Ki Duniya - Suniye "${song.title}" by ${song.artist} (${song.year})!\n${window.location.href}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="postcard-modal-backdrop" onClick={onClose}>
      <div className="postcard-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="postcard-container">
          {/* Postcard Stamp & Header */}
          <div className="postcard-header">
            <div className="postcard-postmark">
              <span className="postmark-city">PATNA GPO</span>
              <span className="postmark-date">1995 • RETRO MAIL</span>
            </div>
            <div className="postcard-stamp">
              <div className="stamp-inner">
                <span className="stamp-val">50 Paise</span>
                <span className="stamp-icon">🇮🇳</span>
              </div>
            </div>
          </div>

          {/* Postcard Body */}
          <div className="postcard-body">
            {/* Left Column: Message Input */}
            <div className="postcard-left-col">
              <label className="postcard-label">Nostalgic Message:</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={140}
                className="postcard-textarea"
                placeholder="Apna nostalgic message yahan likhiye..."
              />
              <div className="postcard-sender">
                <label>Bhejnewala / Sender:</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="postcard-input"
                />
              </div>
            </div>

            {/* Right Column: Song Address & Stamp */}
            <div className="postcard-right-col">
              <div className="postcard-address-lines">
                <div className="addr-line song-title-line">🎵 <b>{song.title}</b></div>
                <div className="addr-line song-artist-line">🎙️ {song.artist} ({song.year})</div>
                <div className="addr-line scene-line">📍 {scene?.hindi || 'Yaadon Ki Duniya'}</div>
                <div className="addr-line pin-line">📮 PIN: 800001 (Nostalgia)</div>
              </div>
            </div>
          </div>

          {/* Postcard Footer */}
          <div className="postcard-footer">
            <button className="postcard-action-btn primary" onClick={handleShare}>
              {copied ? <Check size={16} /> : <Send size={16} />}
              <span>{copied ? 'Link Copied!' : 'Chitthi Share Karo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
