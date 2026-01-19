import type { PlaylistLinks as PlaylistLinksType } from '../types';

interface PlaylistLinksProps {
  links: PlaylistLinksType;
}

const platformInfo = {
  spotify: {
    name: 'Spotify',
    color: '#1DB954',
    icon: '🎵',
  },
  appleMusic: {
    name: 'Apple Music',
    color: '#FA243C',
    icon: '🍎',
  },
  youtubeMusic: {
    name: 'YouTube Music',
    color: '#FF0000',
    icon: '▶️',
  },
  melon: {
    name: 'Melon',
    color: '#00CD3C',
    icon: '🍈',
  },
};

export function PlaylistLinks({ links }: PlaylistLinksProps) {
  const availablePlatforms = Object.entries(links).filter(([, url]) => url);

  if (availablePlatforms.length === 0) {
    return <p className="no-playlist">플레이리스트가 준비되지 않았습니다.</p>;
  }

  return (
    <div className="playlist-links">
      <h4>🎧 셋리스트 플레이리스트</h4>
      <div className="platform-buttons">
        {availablePlatforms.map(([platform, url]) => {
          const info = platformInfo[platform as keyof typeof platformInfo];
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-button"
              style={{ '--platform-color': info.color } as React.CSSProperties}
            >
              <span className="platform-icon">{info.icon}</span>
              <span className="platform-name">{info.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
