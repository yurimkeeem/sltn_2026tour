import { useState, useRef, useEffect } from 'react';
import { getRandomLyrics } from '../data/lyricsApi';

interface TicketIssuanceModalProps {
  onClose: () => void;
}

// 콘서트 진행 지역 목록
const CITIES = [
  { name: '춘천', code: 'CHN' },
  { name: '전주', code: 'JEO' },
  { name: '부산', code: 'PUS' },
  { name: '대구', code: 'TAE' },
  { name: '대전', code: 'DJN' },
  { name: '서울', code: 'SEL' },
] as const;

interface TicketData {
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  passenger: string;
  seat: string;
  lyrics: string[];
}

export function TicketIssuanceModal({ onClose }: TicketIssuanceModalProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passenger, setPassenger] = useState('');
  const [seat, setSeat] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  // 배경 이미지 로드
  useEffect(() => {
    const img = new Image();
    img.src = '/E-ticket.png';
    img.onload = () => setBgImage(img);
  }, []);

  const fromCity = CITIES.find((c) => c.name === from);
  const toCity = CITIES.find((c) => c.name === to);

  const isFormValid = from && to && passenger.trim() && seat.trim() && from !== to;

  // 티켓 생성
  const handleGenerateTicket = async () => {
    if (!isFormValid || !fromCity || !toCity) return;

    setIsGenerating(true);

    try {
      const lyrics = await getRandomLyrics(4);

      const data: TicketData = {
        from: fromCity.name,
        fromCode: fromCity.code,
        to: toCity.name,
        toCode: toCity.code,
        passenger: passenger.trim().toUpperCase(),
        seat: seat.trim() + 'A',
        lyrics,
      };

      setTicketData(data);
    } catch (error) {
      console.error('Failed to generate ticket:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 티켓 이미지 그리기
  useEffect(() => {
    if (!ticketData || !canvasRef.current || !bgImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기를 배경 이미지 크기에 맞춤
    canvas.width = bgImage.width;
    canvas.height = bgImage.height;

    // 배경 이미지 그리기
    ctx.drawImage(bgImage, 0, 0);

    // 텍스트 스타일 설정
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'top';

    // 폰트 크기
    const mainFontSize = 160; // FROM, TO, SEAT
    const nameFontSize = 158; // PASSENGER NAME
    const lyricsFontSize = 81;

    // ===== 상단 영역 (가로 텍스트) =====

    // FROM 코드 (왼쪽 정렬)
    ctx.font = `bold ${mainFontSize}px Arial, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(ticketData.fromCode, 431, 1221.33);

    // TO 코드 (왼쪽 정렬)
    ctx.fillText(ticketData.toCode, 1644.93, 1221.33);

    // PASSENGER NAME (폰트 크기 자동 조절)
    const maxNameWidth = 1900; // 최대 너비 (캔버스 여백 고려)
    let adjustedNameFontSize = nameFontSize;
    ctx.font = `bold ${adjustedNameFontSize}px Arial, sans-serif`;
    while (ctx.measureText(ticketData.passenger).width > maxNameWidth && adjustedNameFontSize > 60) {
      adjustedNameFontSize -= 5;
      ctx.font = `bold ${adjustedNameFontSize}px Arial, sans-serif`;
    }
    ctx.fillText(ticketData.passenger, 200.1, 1848.53);

    // SEAT
    ctx.font = `bold ${mainFontSize}px Arial, sans-serif`;
    ctx.fillText(ticketData.seat, 1729.1, 2197.53);

    // 가사 (가운데 정렬, italic, 폰트 크기 자동 조절)
    const maxLyricsWidth = 2000; // 바코드 너비 기준
    let adjustedLyricsFontSize = lyricsFontSize;
    ctx.font = `italic ${adjustedLyricsFontSize}px Arial, sans-serif`;

    // 가장 긴 가사 줄이 최대 너비를 넘지 않을 때까지 폰트 크기 줄이기
    const getMaxLineWidth = () => {
      return Math.max(...ticketData.lyrics.map(line => ctx.measureText(line).width));
    };
    while (getMaxLineWidth() > maxLyricsWidth && adjustedLyricsFontSize > 40) {
      adjustedLyricsFontSize -= 3;
      ctx.font = `italic ${adjustedLyricsFontSize}px Arial, sans-serif`;
    }

    ctx.textAlign = 'center';
    const lineHeight = adjustedLyricsFontSize * 1.5;
    const lyricsCenterY = 2700; // Y축 중심점 (4줄 기준)
    const totalLyricsHeight = (ticketData.lyrics.length - 1) * lineHeight;
    const lyricsStartY = lyricsCenterY - totalLyricsHeight / 2;
    ticketData.lyrics.forEach((line, index) => {
      ctx.fillText(line, 1179, lyricsStartY + index * lineHeight);
    });

    // ===== 하단 스텁 영역 (세로 텍스트 - 시계방향 90도 회전) =====
    const drawVerticalText = (text: string, x: number, y: number, fontSize: number) => {
      ctx.save();
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 2); // 시계방향 90도 회전
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    // PASSENGER NAME (하단) - 세로 영역에 맞게 별도 폰트 크기 계산
    const maxVerticalNameWidth = 1100; // 하단 스텁의 세로 가용 너비
    let adjustedVerticalNameFontSize = nameFontSize;
    ctx.font = `bold ${adjustedVerticalNameFontSize}px Arial, sans-serif`;
    while (ctx.measureText(ticketData.passenger).width > maxVerticalNameWidth && adjustedVerticalNameFontSize > 50) {
      adjustedVerticalNameFontSize -= 5;
      ctx.font = `bold ${adjustedVerticalNameFontSize}px Arial, sans-serif`;
    }
    drawVerticalText(ticketData.passenger, 1116.37, 3741.09, adjustedVerticalNameFontSize);

    // FROM (하단)
    drawVerticalText(ticketData.fromCode, 1675.63, 3845.81, mainFontSize);

    // TO (하단)
    drawVerticalText(ticketData.toCode, 1675.63, 4531.12, mainFontSize);

    // SEAT (하단)
    drawVerticalText(ticketData.seat, 417.13, 4437.52, mainFontSize);
  }, [ticketData, bgImage]);

  // 이미지 다운로드
  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `SLTN_TICKET_${ticketData?.fromCode}_${ticketData?.toCode}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // 티켓 생성 후 화면
  if (ticketData) {
    return (
      <div className="ticket-modal-overlay" onClick={onClose}>
        <div className="ticket-modal ticket-modal--preview" onClick={(e) => e.stopPropagation()}>
          <button className="ticket-modal-close" onClick={onClose}>
            ✕
          </button>

          <div className="ticket-preview-content">
            <canvas ref={canvasRef} className="ticket-canvas" />

            <button className="ticket-action-btn ticket-action-btn--primary" onClick={handleDownload}>
              다운로드
            </button>

            <button className="ticket-reset-btn" onClick={() => setTicketData(null)}>
              다시 만들기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ticket-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="ticket-modal-header">
          <h3>What's your ETA?</h3>
          <p>나만의 SLTN 탑승권을 만들어보세요!</p>
        </div>

        <form
          className="ticket-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateTicket();
          }}
        >
          <div className="ticket-form-row">
            <div className="ticket-form-group">
              <label htmlFor="ticket-from">출발지</label>
              <select
                id="ticket-from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              >
                <option value="">선택하세요</option>
                {CITIES.map((city) => (
                  <option key={city.code} value={city.name}>
                    {city.name} ({city.code})
                  </option>
                ))}
              </select>
            </div>

            <span className="ticket-form-arrow">→</span>

            <div className="ticket-form-group">
              <label htmlFor="ticket-to">도착지</label>
              <select
                id="ticket-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              >
                <option value="">선택하세요</option>
                {CITIES.map((city) => (
                  <option key={city.code} value={city.name}>
                    {city.name} ({city.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {from && to && from === to && (
            <p className="ticket-form-error">출발지와 도착지가 같을 수 없습니다.</p>
          )}

          <div className="ticket-form-group">
            <label htmlFor="ticket-passenger">탑승자명</label>
            <input
              id="ticket-passenger"
              type="text"
              value={passenger}
              onChange={(e) => setPassenger(e.target.value)}
              placeholder="영문으로 입력해 주세요."
              maxLength={50}
              required
            />
            <span className="ticket-char-count">{passenger.length}/50</span>
          </div>

          <div className="ticket-form-group">
            <label htmlFor="ticket-seat">입장번호</label>
            <input
              id="ticket-seat"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={seat}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setSeat(value);
              }}
              placeholder="숫자만 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            className="ticket-submit-btn"
            disabled={!isFormValid || isGenerating}
          >
            {isGenerating ? '생성 중...' : '티켓 발권하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
