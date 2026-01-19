// 투어 데이터 타입 정의

export interface Song {
  title: string;
  artist?: string; // 커버곡인 경우
}

export interface PlaylistLinks {
  appleMusic?: string;
  spotify?: string;
  youtubeMusic?: string;
  melon?: string;
}

export interface Tweet {
  id: string;
  url: string;
  author: string;
  authorHandle: string;
  content: string;
  likes: number;
  retweets: number;
  date: string;
}

export interface TourDate {
  id: string;
  city: string;
  venue: string;
  date: string;
  coordinates: [number, number]; // [lat, lng]
  setlist: Song[];
  playlistLinks: PlaylistLinks;
  featuredTweets: Tweet[];
  photoUrl?: string;
  expectedSetlistSize?: number; // 예상 셋리스트 곡 수 (투표용)
  ticketLink?: string; // 티켓 구매 링크
}

// 셋리스트 투표 관련 타입
export interface SetlistVote {
  odepourId: string;
  odepourNickname: string;
  selectedSongs: string[]; // 곡 제목 배열
  votedAt: string;
}

export interface SongVoteResult {
  title: string;
  voteCount: number;
  percentage: number;
}

export interface TourInfo {
  bandName: string;
  tourName: string;
  year: number;
  description: string;
  tourDates: TourDate[];
  posterUrl?: string; // 투어 포스터 이미지
}
