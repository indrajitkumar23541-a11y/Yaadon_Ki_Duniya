export type MoodType = 'all' | 'romantic' | 'travel' | 'masti' | 'sad' | 'morning';

interface MoodFilterProps {
  currentMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

const MOODS: { id: MoodType; label: string; icon: string }[] = [
  { id: 'all', label: 'Sabhi Gaane', icon: '✨' },
  { id: 'romantic', label: 'Dil Se Romantic', icon: '❤️' },
  { id: 'travel', label: 'Travel Roadtrip', icon: '🚗' },
  { id: 'masti', label: 'High Energy Masti', icon: '🕺' },
  { id: 'sad', label: 'Birha & Yaadein', icon: '😢' },
  { id: 'morning', label: 'Morning Melodies', icon: '🌄' },
];

export default function MoodFilter({ currentMood, onSelectMood }: MoodFilterProps) {
  return (
    <div className="mood-filter-bar">
      <span className="mood-label">MOOD FILTER:</span>
      <div className="mood-pills">
        {MOODS.map(m => (
          <button
            key={m.id}
            className={`mood-pill ${currentMood === m.id ? 'active' : ''}`}
            onClick={() => onSelectMood(m.id)}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
