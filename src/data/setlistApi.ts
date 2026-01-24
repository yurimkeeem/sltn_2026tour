// 셋리스트 Google Sheets API

import type { Song } from '../types';

const SETLIST_SHEET_ID = import.meta.env.VITE_SETLIST_SHEET_ID;

// 도시별 컬럼 매핑 (A열부터)
const CITY_COLUMNS: Record<string, string> = {
  '춘천': 'A',
  '전주': 'B',
  '부산': 'C',
  '대구': 'D',
  '대전': 'E',
  '서울': 'F',
};

// 특정 도시의 셋리스트 조회 URL
function getSetlistSheetUrl(column: string): string {
  const query = encodeURIComponent(`SELECT ${column}`);
  return `https://docs.google.com/spreadsheets/d/${SETLIST_SHEET_ID}/gviz/tq?tqx=out:json&tq=${query}`;
}

// 시트 데이터 파싱
function parseSetlistData(jsonText: string): Song[] {
  const jsonMatch = jsonText.match(
    /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/
  );
  if (!jsonMatch) return [];

  try {
    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table?.rows || [];

    return rows
      .slice(1) // 첫 번째 행(헤더) 건너뛰기
      .map((row: { c: Array<{ v: string } | null> }) => {
        const value = row.c[0]?.v;
        if (!value || typeof value !== 'string') return null;

        // 커버곡 처리: "곡명 (Cover: 아티스트)" 형식
        const coverMatch = value.match(/^(.+?)\s*\(Cover:\s*(.+?)\)$/);
        if (coverMatch) {
          return {
            title: coverMatch[1].trim(),
            artist: coverMatch[2].trim(),
          };
        }

        return { title: value.trim() };
      })
      .filter((song: Song | null): song is Song => song !== null && song.title !== '');
  } catch (e) {
    console.error('Failed to parse setlist data:', e);
    return [];
  }
}

// 특정 도시의 셋리스트 조회
export async function fetchSetlist(city: string): Promise<Song[]> {
  if (!SETLIST_SHEET_ID) {
    console.warn('VITE_SETLIST_SHEET_ID not set');
    return [];
  }

  const column = CITY_COLUMNS[city];
  if (!column) {
    console.warn(`Unknown city: ${city}`);
    return [];
  }

  try {
    const response = await fetch(getSetlistSheetUrl(column));
    const text = await response.text();
    return parseSetlistData(text);
  } catch (error) {
    console.error(`Failed to fetch setlist for ${city}:`, error);
    return [];
  }
}

// 모든 도시의 셋리스트 조회
export async function fetchAllSetlists(): Promise<Record<string, Song[]>> {
  if (!SETLIST_SHEET_ID) {
    console.warn('VITE_SETLIST_SHEET_ID not set');
    return {};
  }

  const results: Record<string, Song[]> = {};

  // 병렬로 모든 도시 조회
  const cities = Object.keys(CITY_COLUMNS);
  const promises = cities.map(async (city) => {
    const setlist = await fetchSetlist(city);
    return { city, setlist };
  });

  const responses = await Promise.all(promises);
  responses.forEach(({ city, setlist }) => {
    results[city] = setlist;
  });

  return results;
}

// 설정 여부 확인
export function isSetlistConfigured(): boolean {
  return Boolean(SETLIST_SHEET_ID);
}
