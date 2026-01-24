import type { Song } from '../types';

interface SetlistDisplayProps {
  setlist: Song[];
}

export function SetlistDisplay({ setlist }: SetlistDisplayProps) {
  // 첫 번째 열: 최대 10곡, 두 번째 열: 11곡부터
  const firstColumn = setlist.slice(0, 10);
  const secondColumn = setlist.slice(10);

  const renderSong = (song: Song, index: number) => (
    <li key={index} className="setlist-item">
      <span className="song-number">{index + 1}</span>
      <span className="song-title">{song.title}</span>
      {song.artist && (
        <span className="song-cover">(Cover: {song.artist})</span>
      )}
    </li>
  );

  return (
    <div className="setlist-section">
      <h4>🎤 셋리스트</h4>
      <div className="setlist-columns">
        <ol className="setlist-column">
          {firstColumn.map((song, index) => renderSong(song, index))}
        </ol>
        {secondColumn.length > 0 && (
          <ol className="setlist-column" start={11}>
            {secondColumn.map((song, index) => renderSong(song, index + 10))}
          </ol>
        )}
      </div>
    </div>
  );
}
