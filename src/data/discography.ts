// 솔루션스 전곡 리스트 (디스코그래피)
// 앨범별로 정리 - 실제 데이터로 업데이트 필요

export const discography = [
  // 춘천 셋리스트 기반 곡 목록
  { title: 'Superstition', album: '싱글/EP' },
  { title: 'Maximizer', album: '싱글/EP' },
  { title: 'Fireworxx', album: '싱글/EP' },
  { title: '三', album: '싱글/EP' },
  { title: 'Love you dear', album: '싱글/EP' },
  { title: 'Dance with me', album: '싱글/EP' },
  { title: '까만 밤', album: '싱글/EP' },
  { title: '미로', album: '싱글/EP' },
  { title: 'Starsynth', album: '싱글/EP' },
  { title: 'Venus', album: '싱글/EP' },
  { title: 'N/A', album: '싱글/EP' },
  { title: '혼', album: '싱글/EP' },
  { title: 'Brand new day', album: '싱글/EP' },
  { title: "Can't wait", album: '싱글/EP' },
  { title: '숨', album: '싱글/EP' },
  { title: '종', album: '싱글/EP' },
  { title: '멸', album: '싱글/EP' },
  { title: '문', album: '싱글/EP' },
  { title: 'Otherside', album: '싱글/EP' },
  { title: 'DNCM', album: '싱글/EP' },
  { title: 'Athena', album: '싱글/EP' },
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
