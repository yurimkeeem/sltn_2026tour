// 솔루션스 전곡 리스트 (디스코그래피)
// 실제 데이터로 업데이트 필요

export const discography = [
  // 정규 1집 예시
  { title: '비행', album: '1집' },
  { title: 'Fever', album: '1집' },
  { title: 'Dance with You', album: '1집' },
  { title: '넌 내게로', album: '1집' },
  { title: 'New Generation', album: '1집' },
  { title: 'Tick Tock', album: '1집' },
  { title: '선인장', album: '1집' },
  { title: 'Paradise', album: '1집' },

  // 정규 2집 예시
  { title: 'Youth', album: '2집' },
  { title: 'Summer Night', album: '2집' },
  { title: 'Electric Love', album: '2집' },
  { title: 'Run Away', album: '2집' },
  { title: 'Moonlight', album: '2집' },
  { title: 'Stay', album: '2집' },

  // 싱글/EP 예시
  { title: 'First Light', album: 'Single' },
  { title: 'Dreams', album: 'EP' },
  { title: 'Endless Summer', album: 'EP' },
  { title: 'City Lights', album: 'Single' },
];

// 앨범별로 그룹핑
export const discographyByAlbum = discography.reduce(
  (acc, song) => {
    if (!acc[song.album]) {
      acc[song.album] = [];
    }
    acc[song.album].push(song.title);
    return acc;
  },
  {} as Record<string, string[]>
);

// 전체 곡 제목 리스트
export const allSongTitles = discography.map((song) => song.title);
