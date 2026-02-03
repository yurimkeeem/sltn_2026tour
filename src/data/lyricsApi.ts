// 티켓 발권용 랜덤 가사 Google Sheets API

const LYRICS_SHEET_ID = '1wwqzCAvLbBsIODFC1tJZldtLFAWk4iCfeojdDfsa6aU';

// 가사 데이터 조회 URL (A열에서 가사 가져오기)
function getLyricsSheetUrl(): string {
  const query = encodeURIComponent('SELECT A');
  return `https://docs.google.com/spreadsheets/d/${LYRICS_SHEET_ID}/gviz/tq?tqx=out:json&tq=${query}`;
}

// 시트 데이터 파싱
function parseLyricsData(jsonText: string): string[] {
  const jsonMatch = jsonText.match(
    /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/
  );
  if (!jsonMatch) return [];

  try {
    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table?.rows || [];

    return rows
      .map((row: { c: Array<{ v: string } | null> }) => {
        const cells = row.c;
        return cells[0]?.v || '';
      })
      .filter((lyric: string) => lyric.trim() !== '');
  } catch (e) {
    console.error('Failed to parse lyrics data:', e);
    return [];
  }
}

// 전체 가사 목록 조회
export async function fetchLyrics(): Promise<string[]> {
  try {
    const response = await fetch(getLyricsSheetUrl());
    const text = await response.text();
    return parseLyricsData(text);
  } catch (error) {
    console.error('Failed to fetch lyrics:', error);
    return [];
  }
}

// 랜덤 가사 가져오기 (한 셀에 최대 maxLines줄의 가사가 줄바꿈으로 입력됨)
export async function getRandomLyrics(maxLines: number = 3): Promise<string[]> {
  const allLyricsCells = await fetchLyrics();

  if (allLyricsCells.length === 0) {
    return [];
  }

  // 랜덤으로 하나의 셀(행) 선택
  const randomIndex = Math.floor(Math.random() * allLyricsCells.length);
  const selectedCell = allLyricsCells[randomIndex];

  // 셀 내용을 줄바꿈으로 분리하고 최대 maxLines줄까지만 반환
  const lines = selectedCell
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .slice(0, maxLines);

  return lines;
}

// 설정 여부 확인
export function isLyricsConfigured(): boolean {
  return Boolean(LYRICS_SHEET_ID);
}
