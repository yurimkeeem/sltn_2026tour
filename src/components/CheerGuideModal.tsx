import { useState } from 'react';
import { cheerGuideData, cheerGuideMedia } from '../data/cheerGuide';

interface CheerGuideModalProps {
  onClose: () => void;
}

export function CheerGuideModal({ onClose }: CheerGuideModalProps) {
  const [selectedSongIndex, setSelectedSongIndex] = useState(0);
  const selectedSong = cheerGuideData[selectedSongIndex];

  return (
    <div className="cheer-guide-overlay" onClick={onClose}>
      <div className="cheer-guide-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cheer-guide-close" onClick={onClose}>
          ✕
        </button>

        <div className="cheer-guide-header">
          <h2>알림장</h2>
          <p>오경쌤 숙제</p>
        </div>

        <div className="cheer-guide-content">
          {/* PC: 좌측 영상 | 중앙 가사 | 우측 탭 */}
          {/* 모바일: 상단 탭 | 중앙 가사 | 하단 영상 */}

          {/* 곡 선택 탭 (모바일: 상단, PC: 우측) */}
          <div className="cheer-guide-tabs">
            {cheerGuideData.map((song, index) => (
              <button
                key={song.title}
                className={`cheer-guide-tab ${selectedSongIndex === index ? 'cheer-guide-tab--active' : ''}`}
                onClick={() => setSelectedSongIndex(index)}
              >
                {song.title}
              </button>
            ))}
          </div>

          {/* 가사 영역 */}
          <div className="cheer-guide-lyrics">
            <h3 className="cheer-guide-song-title">{selectedSong.title}</h3>
            <div className="cheer-guide-lyrics-content">
              {selectedSong.lyrics.map((line, lineIdx) => (
                <p key={lineIdx} className={line.length === 0 ? 'cheer-guide-empty-line' : ''}>
                  {line.map((part, partIdx) => (
                    <span
                      key={partIdx}
                      className={part.highlight ? 'cheer-highlight' : ''}
                    >
                      {part.text}
                    </span>
                  ))}
                </p>
              ))}
              {selectedSong.note && (
                <p className="cheer-guide-note">
                  {selectedSong.note.split('Hey!').map((part, idx, arr) => (
                    <span key={idx}>
                      {part}
                      {idx < arr.length - 1 && <span className="cheer-highlight">Hey!</span>}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          {/* 영상 영역 */}
          <div className="cheer-guide-video">
            <div className="cheer-guide-video-wrapper">
              <video
                src="/sltn-video.mp4"
                controls
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
              />
            </div>
            <p className="cheer-guide-credit">{cheerGuideMedia.credit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
