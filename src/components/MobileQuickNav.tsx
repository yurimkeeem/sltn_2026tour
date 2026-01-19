interface MobileQuickNavProps {
  hasSetlist: boolean;
  hasTweets: boolean;
}

export function MobileQuickNav({ hasSetlist, hasTweets }: MobileQuickNavProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="mobile-quick-nav">
      <button onClick={() => scrollToSection('schedule-section')}>
        <span>📅</span> 공연일정
      </button>
      {hasSetlist && (
        <button onClick={() => scrollToSection('setlist-section')}>
          <span>🎵</span> 셋리스트
        </button>
      )}
      {hasTweets && (
        <button onClick={() => scrollToSection('tweets-section')}>
          <span>💬</span> HIT TWEETS
        </button>
      )}
    </nav>
  );
}
