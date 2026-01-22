// 전광판 메시지 Google Sheets API

export interface MarqueeMessage {
  id: string;
  nickname: string;
  message: string;
  timestamp: string;
}

const MARQUEE_SHEET_ID = import.meta.env.VITE_MARQUEE_SHEET_ID;
const MARQUEE_FORM_ID = import.meta.env.VITE_MARQUEE_FORM_ID;

// 승인된 메시지만 조회 (D열이 TRUE인 것만)
function getMarqueeSheetUrl(): string {
  const query = encodeURIComponent("SELECT A, B, C WHERE D = TRUE");
  return `https://docs.google.com/spreadsheets/d/${MARQUEE_SHEET_ID}/gviz/tq?tqx=out:json&tq=${query}`;
}

// Google Form 제출 URL
function getMarqueeFormUrl(): string {
  return `https://docs.google.com/forms/d/e/${MARQUEE_FORM_ID}/formResponse`;
}

// 시트 데이터 파싱
function parseMarqueeData(jsonText: string): MarqueeMessage[] {
  const jsonMatch = jsonText.match(
    /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/
  );
  if (!jsonMatch) return [];

  try {
    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table?.rows || [];

    return rows
      .map((row: { c: Array<{ v: string } | null> }, index: number) => {
        const cells = row.c;
        // SELECT A, B, C → [0: 타임스탬프, 1: 메시지, 2: 닉네임]
        return {
          id: `marquee-${index}-${cells[0]?.v || ''}`,
          timestamp: cells[0]?.v || '',
          nickname: cells[2]?.v || '',
          message: cells[1]?.v || '',
        };
      })
      .filter((msg: MarqueeMessage) => msg.nickname && msg.message);
  } catch (e) {
    console.error('Failed to parse marquee data:', e);
    return [];
  }
}

// 승인된 메시지 조회
export async function fetchMarqueeMessages(): Promise<MarqueeMessage[]> {
  if (!MARQUEE_SHEET_ID) {
    console.warn('VITE_MARQUEE_SHEET_ID not set');
    return [];
  }

  try {
    const response = await fetch(getMarqueeSheetUrl());
    const text = await response.text();
    return parseMarqueeData(text);
  } catch (error) {
    console.error('Failed to fetch marquee messages:', error);
    return [];
  }
}

// 메시지 제출 (승인 대기 상태로)
export async function submitMarqueeMessage(
  nickname: string,
  message: string
): Promise<boolean> {
  if (!MARQUEE_FORM_ID) {
    console.warn('VITE_MARQUEE_FORM_ID not set');
    return false;
  }

  const formData = new FormData();
  formData.append('entry.580927478', nickname);   // 닉네임
  formData.append('entry.1800568353', message);   // 메시지

  try {
    await fetch(getMarqueeFormUrl(), {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
    return true;
  } catch (error) {
    console.error('Failed to submit marquee message:', error);
    return false;
  }
}

// 설정 여부 확인
export function isMarqueeConfigured(): boolean {
  return Boolean(MARQUEE_SHEET_ID);
}

export function isMarqueeFormConfigured(): boolean {
  return Boolean(MARQUEE_FORM_ID);
}
