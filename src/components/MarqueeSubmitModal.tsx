import { useState } from 'react';
import {
  submitMarqueeMessage,
  isMarqueeFormConfigured,
} from '../data/marqueeApi';

interface MarqueeSubmitModalProps {
  onClose: () => void;
}

export function MarqueeSubmitModal({ onClose }: MarqueeSubmitModalProps) {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);

    const success = await submitMarqueeMessage(nickname.trim(), message.trim());

    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
    }
  };

  if (!isMarqueeFormConfigured()) {
    return (
      <div className="marquee-modal-overlay" onClick={onClose}>
        <div className="marquee-modal" onClick={(e) => e.stopPropagation()}>
          <button className="marquee-modal-close" onClick={onClose}>
            ✕
          </button>
          <div className="marquee-modal-content">
            <p>현재 메시지 제출 기능이 비활성화되어 있습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="marquee-modal-overlay" onClick={onClose}>
        <div className="marquee-modal" onClick={(e) => e.stopPropagation()}>
          <button className="marquee-modal-close" onClick={onClose}>
            ✕
          </button>
          <div className="marquee-modal-content marquee-modal-success">
            <span className="marquee-success-icon">✓</span>
            <h3>메시지가 제출되었습니다!</h3>
            <p>관리자 승인 후 전광판에 표시됩니다.</p>
            <button className="marquee-done-btn" onClick={onClose}>
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="marquee-modal-overlay" onClick={onClose}>
      <div className="marquee-modal" onClick={(e) => e.stopPropagation()}>
        <button className="marquee-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="marquee-modal-header">
          <h3>전광판 메시지 남기기</h3>
          <p>솔루션스에게 응원 메시지를 보내주세요!</p>
        </div>

        <form className="marquee-form" onSubmit={handleSubmit}>
          <div className="marquee-form-group">
            <label htmlFor="marquee-nickname">닉네임</label>
            <input
              id="marquee-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              maxLength={10}
              required
            />
            <span className="marquee-char-count">{nickname.length}/10</span>
          </div>

          <div className="marquee-form-group">
            <label htmlFor="marquee-message">메시지</label>
            <textarea
              id="marquee-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="응원 메시지를 입력하세요"
              maxLength={30}
              rows={2}
              required
            />
            <span className="marquee-char-count">
              {message.replace(/\s/g, '').length}/15 (공백 제외)
            </span>
          </div>

          <button
            type="submit"
            className="marquee-submit-form-btn"
            disabled={
              isSubmitting ||
              !nickname.trim() ||
              !message.trim() ||
              message.replace(/\s/g, '').length > 15
            }
          >
            {isSubmitting ? '제출 중...' : '메시지 보내기'}
          </button>
        </form>
      </div>
    </div>
  );
}
