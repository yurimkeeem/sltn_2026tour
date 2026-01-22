import { useEffect, useState } from 'react';
import {
  fetchMarqueeMessages,
  isMarqueeConfigured,
  type MarqueeMessage,
} from '../data/marqueeApi';

// 형광 컬러 배열
const NEON_COLORS = [
  '#ffff00', // 형광노랑
  '#ff1493', // 형광핑크
  '#7fff00', // 형광연두
  '#ff6600', // 형광주황
  '#bf00ff', // 형광보라
];

// 랜덤 컬러 선택
const getRandomColor = () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];

export function MarqueeBanner() {
  const [messages, setMessages] = useState<MarqueeMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      if (!isMarqueeConfigured()) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchMarqueeMessages();
        setMessages(data);
      } catch (error) {
        console.error('Failed to load marquee messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
    // 30초마다 메시지 갱신
    const interval = setInterval(loadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  // 메시지가 없으면 기본 메시지 표시
  const displayMessages =
    messages.length > 0
      ? messages
      : [
          {
            id: 'default',
            nickname: 'SOLUTIONS',
            message: '2026 투어에 오신 것을 환영합니다!',
            timestamp: '',
          },
        ];

  // 메시지 개수에 따른 동적 속도 계산 (메시지당 8초, 최소 10초)
  const animationDuration = Math.max(displayMessages.length * 8, 10);

  // 메시지 렌더링 함수
  const renderMessages = (keyPrefix: string) =>
    displayMessages.map((msg, index) => (
      <span key={`${keyPrefix}-${msg.id}-${index}`} className="marquee-item">
        <span className="marquee-message">{msg.message}</span>
        <span className="marquee-nickname" style={{ color: getRandomColor() }}>
          {msg.nickname}
        </span>
      </span>
    ));

  return (
    <div className="marquee-banner">
      <div className="marquee-content">
        <div
          className="marquee-track"
          style={{ animationDuration: `${animationDuration}s` }}
        >
          {renderMessages('a')}
          {renderMessages('b')}
        </div>
        <div
          className="marquee-track marquee-track--clone"
          style={{ animationDuration: `${animationDuration}s` }}
        >
          {renderMessages('c')}
          {renderMessages('d')}
        </div>
      </div>
    </div>
  );
}
