// Google Sheets에서 투표 데이터 읽어오기
// 무료로 백엔드 없이 데이터 공유 가능!

import type { SetlistVote, SongVoteResult } from '../types';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID;
const FORM_ID = import.meta.env.VITE_GOOGLE_FORMS_ID;

// Google Sheets를 JSON으로 읽어오는 URL
function getSheetJsonUrl(): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
}

// Google Form 제출 URL
function getFormSubmitUrl(): string {
  return `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
}

interface SheetRow {
  timestamp: string;
  tourDateId: string;
  nickname: string;
  songs: string;
}

// Sheets 데이터 파싱
// Google Form 컬럼 순서: [타임스탬프, 이메일, tourDateId, nickname, songs]
function parseSheetData(jsonText: string): SheetRow[] {
  // Google Sheets JSON 응답은 "google.visualization.Query.setResponse(...)" 형태
  const jsonMatch = jsonText.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
  if (!jsonMatch) return [];

  try {
    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table.rows;

    return rows.map((row: { c: Array<{ v: string } | null> }) => {
      const cells = row.c;
      // 이메일 수집 활성화 시: [타임스탬프(0), 이메일(1), tourDateId(2), nickname(3), songs(4)]
      return {
        timestamp: cells[0]?.v || '',
        tourDateId: cells[2]?.v || '',
        nickname: cells[3]?.v || '',
        songs: cells[4]?.v || '',
      };
    }).filter((row: SheetRow) => row.tourDateId && row.songs);
  } catch (e) {
    console.error('Failed to parse sheet data:', e);
    return [];
  }
}

// 모든 투표 데이터 가져오기
export async function fetchAllVotes(): Promise<Record<string, SetlistVote[]>> {
  if (!SHEET_ID) {
    console.warn('VITE_GOOGLE_SHEET_ID not set, using localStorage fallback');
    return {};
  }

  try {
    const response = await fetch(getSheetJsonUrl());
    const text = await response.text();
    const rows = parseSheetData(text);

    const votesByTourDate: Record<string, SetlistVote[]> = {};

    rows.forEach((row, index) => {
      const vote: SetlistVote = {
        odepourId: `sheet-${index}-${row.timestamp}`,
        odepourNickname: row.nickname,
        selectedSongs: row.songs.split(',').map(s => s.trim()).filter(Boolean),
        votedAt: row.timestamp,
      };

      if (!votesByTourDate[row.tourDateId]) {
        votesByTourDate[row.tourDateId] = [];
      }
      votesByTourDate[row.tourDateId].push(vote);
    });

    return votesByTourDate;
  } catch (error) {
    console.error('Failed to fetch votes from Google Sheets:', error);
    return {};
  }
}

// 특정 공연의 투표 데이터 가져오기
export async function fetchVotesForTourDate(tourDateId: string): Promise<SetlistVote[]> {
  const allVotes = await fetchAllVotes();
  return allVotes[tourDateId] || [];
}

// 투표 결과 집계
export async function fetchVoteResults(tourDateId: string): Promise<SongVoteResult[]> {
  const votes = await fetchVotesForTourDate(tourDateId);

  if (votes.length === 0) return [];

  const songCounts: Record<string, number> = {};

  votes.forEach(vote => {
    vote.selectedSongs.forEach(song => {
      songCounts[song] = (songCounts[song] || 0) + 1;
    });
  });

  return Object.entries(songCounts)
    .map(([title, voteCount]) => ({
      title,
      voteCount,
      percentage: Math.round((voteCount / votes.length) * 100),
    }))
    .sort((a, b) => b.voteCount - a.voteCount);
}

// 총 투표자 수
export async function fetchTotalVoters(tourDateId: string): Promise<number> {
  const votes = await fetchVotesForTourDate(tourDateId);
  return votes.length;
}

// Google Form으로 투표 제출
export async function submitVoteToForm(
  tourDateId: string,
  nickname: string,
  selectedSongs: string[],
  email?: string
): Promise<boolean> {
  if (!FORM_ID) {
    console.warn('VITE_GOOGLE_FORM_ID not set');
    return false;
  }

  const formData = new FormData();
  formData.append('entry.1553378317', tourDateId);  // tourDateId 필드
  formData.append('entry.412713598', nickname);     // nickname 필드
  formData.append('entry.1309951225', selectedSongs.join(', ')); // songs 필드

  // 이메일이 있으면 Google Forms의 이메일 수집 필드에 추가
  // Google Forms의 "응답자에게 응답 사본 전송" 기능이 이 이메일로 발송됨
  if (email) {
    formData.append('emailAddress', email);
  }

  try {
    // Google Form은 CORS를 허용하지 않아서 iframe 또는 no-cors 모드 사용
    await fetch(getFormSubmitUrl(), {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
    return true;
  } catch (error) {
    console.error('Failed to submit vote:', error);
    return false;
  }
}

// Google Sheets 설정 여부 확인
export function isGoogleSheetsConfigured(): boolean {
  return Boolean(SHEET_ID);
}

export function isGoogleFormConfigured(): boolean {
  return Boolean(FORM_ID);
}
