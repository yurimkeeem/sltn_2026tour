import type { Song } from '../types';

interface SetlistDisplayProps {
  setlist: Song[];
}

export function SetlistDisplay({ setlist }: SetlistDisplayProps) {
  return (
    <div className="setlist-section">
      <h4>🎤 셋리스트</h4>
      <ol className="setlist">
        {setlist.map((song, index) => (
          <li key={index} className="setlist-item">
            <span className="song-number">{index + 1}</span>
            <span className="song-title">{song.title}</span>
            {song.artist && (
              <span className="song-cover">(Cover: {song.artist})</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
