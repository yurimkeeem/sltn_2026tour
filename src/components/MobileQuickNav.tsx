import { useState, useEffect } from 'react';

interface MobileQuickNavProps {
  hasSetlist: boolean;
  hasTweets: boolean;
  hasSelectedRegion: boolean;
  onCheerGuideClick?: () => void;
}

export function MobileQuickNav({ hasSetlist, hasTweets, hasSelectedRegion, onCheerGuideClick }: MobileQuickNavProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSetlistClick = () => {
    if (!hasSelectedRegion) {
      setToastMessage('지역을 먼저 선택해주세요!');
      return;
    }
    scrollToSection('setlist-section');
  };

  const handleTweetsClick = () => {
    if (!hasSelectedRegion) {
      setToastMessage('지역을 먼저 선택해주세요!');
      return;
    }
    scrollToSection('tweets-section');
  };

  return (
    <>
      <nav className="mobile-quick-nav">
        <button onClick={() => scrollToSection('schedule-section')}>
          <span>📅</span> 일정
        </button>
        {hasSetlist && (
          <button onClick={handleSetlistClick}>
            <span>🎵</span> 셋리
          </button>
        )}
        {hasTweets && (
          <button onClick={handleTweetsClick}>
            <span>💬</span> HIT TWEETS
          </button>
        )}
        {onCheerGuideClick && (
          <button onClick={onCheerGuideClick}>
            <span>📣</span> 알림장
          </button>
        )}
      </nav>
      {toastMessage && (
        <div className="toast-alert">{toastMessage}</div>
      )}
    </>
  );
}
