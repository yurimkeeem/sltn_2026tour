// 솔루션스 전곡 리스트 (디스코그래피)

export const discography = [
  // 1집 - THE SOLUTIONS
  { title: 'Sound of The Universe', album: '1집 THE SOLUTIONS' },
  { title: 'Talk, Dance, Party for Love', album: '1집 THE SOLUTIONS' },
  { title: 'Lines', album: '1집 THE SOLUTIONS' },
  { title: 'Silence', album: '1집 THE SOLUTIONS' },
  { title: 'Brand New Day', album: '1집 THE SOLUTIONS' },
  { title: "(I Couldn't Be) Your One", album: '1집 THE SOLUTIONS' },
  { title: "Nothing's Wrong", album: '1집 THE SOLUTIONS' },
  { title: 'Otherside', album: '1집 THE SOLUTIONS' },
  { title: '미로', album: '1집 THE SOLUTIONS' },
  { title: 'Farewell', album: '1집 THE SOLUTIONS' },

  // 2집 - MOVEMENTS
  { title: 'Movements', album: '2집 MOVEMENTS' },
  { title: "Can't wait", album: '2집 MOVEMENTS' },
  { title: "I don't wanna", album: '2집 MOVEMENTS' },
  { title: 'Jungle in your mind', album: '2집 MOVEMENTS' },
  { title: 'My war', album: '2집 MOVEMENTS' },
  { title: "Sailor's song", album: '2집 MOVEMENTS' },
  { title: 'Answer', album: '2집 MOVEMENTS' },
  { title: 'Heavy nights', album: '2집 MOVEMENTS' },
  { title: 'Rise and fall', album: '2집 MOVEMENTS' },
  { title: 'Tonight', album: '2집 MOVEMENTS' },

  // 3집 - N/A
  { title: 'N/A', album: '3집 N/A' },
  { title: 'DNCM', album: '3집 N/A' },
  { title: 'Superstition', album: '3집 N/A' },
  { title: 'ANNIHILATION', album: '3집 N/A' },
  { title: 'ATHENA', album: '3집 N/A' },
  { title: '三', album: '3집 N/A' },
  { title: 'Damn U', album: '3집 N/A' },
  { title: 'Star Synth', album: '3집 N/A' },
  { title: '잎샘', album: '3집 N/A' },
  { title: 'Fireworxx', album: '3집 N/A' },
  { title: 'Maximizer', album: '3집 N/A' },
  { title: 'iPTF14hls', album: '3집 N/A' },
  { title: 'Venus', album: '3집 N/A' },

  // EP - NO PROBLEM!
  { title: 'No Problem!', album: 'EP NO PROBLEM!' },
  { title: 'Love You Dear', album: 'EP NO PROBLEM!' },
  { title: 'Stage', album: 'EP NO PROBLEM!' },
  { title: 'Sing And Flow', album: 'EP NO PROBLEM!' },
  { title: 'L.O.V.E', album: 'EP NO PROBLEM!' },

  // EP - Thumbs Up
  { title: 'Thumbs Up', album: 'EP Thumbs Up' },
  { title: 'Love Again', album: 'EP Thumbs Up' },
  { title: 'Good Time', album: 'EP Thumbs Up' },
  { title: 'Mr. Lover Boy', album: 'EP Thumbs Up' },

  // EP - SIGNATURE
  { title: 'Signature', album: 'EP SIGNATURE' },
  { title: 'Dear My Friend', album: 'EP SIGNATURE' },
  { title: 'Holiday', album: 'EP SIGNATURE' },
  { title: 'In My City', album: 'EP SIGNATURE' },
  { title: 'Savior', album: 'EP SIGNATURE' },
  { title: 'Hurricane', album: 'EP SIGNATURE' },

  // EP - LOAD
  { title: 'Loading', album: 'EP LOAD' },
  { title: 'Dance With Me', album: 'EP LOAD' },
  { title: 'Night Swim', album: 'EP LOAD' },
  { title: '까만 밤', album: 'EP LOAD' },
  { title: 'Oceania', album: 'EP LOAD' },
  { title: 'RUN', album: 'EP LOAD' },

  // EP - TIME
  { title: 'Time', album: 'EP TIME' },
  { title: '너의 이름을 부르면', album: 'EP TIME' },
  { title: '청춘', album: 'EP TIME' },
  { title: 'The Middle', album: 'EP TIME' },
  { title: 'Glory Of Life', album: 'EP TIME' },
  { title: 'People On The Ground', album: 'EP TIME' },

  // EP - 우화
  { title: '틈', album: 'EP 우화' },
  { title: '혼', album: 'EP 우화' },
  { title: '문', album: 'EP 우화' },
  { title: '숨', album: 'EP 우화' },
  { title: '얼룩진 마음을 사랑으로 지울 수 있다면', album: 'EP 우화' },
  { title: '원', album: 'EP 우화' },
  { title: '종', album: 'EP 우화' },
  { title: '멸', album: 'EP 우화' },
  { title: '나', album: 'EP 우화' },

  // 싱글/OST/컴필레이션
  { title: 'Do It!', album: '싱글/OST' },
  { title: 'Ticket to the Moon', album: '싱글/OST' },
  { title: 'BEAUTIFUL', album: '싱글/OST' },
  { title: 'All That You Want', album: '싱글/OST' },
  { title: 'Mood For Love', album: '싱글/OST' },
  { title: '연애바람 (Like Breeze)', album: '싱글/OST' },
  { title: '지금 나보다', album: '싱글/OST' },
  { title: '들꽃', album: '싱글/OST' },
  { title: 'Forever Young', album: '싱글/OST' },
  { title: 'Shine on me', album: '싱글/OST' },
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
