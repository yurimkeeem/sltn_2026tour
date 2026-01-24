import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TourMap } from './components/TourMap';
import { TourList } from './components/TourList';
import { DetailPanel } from './components/DetailPanel';
import { TourPoster } from './components/TourPoster';
import { TourProgressBar } from './components/TourProgressBar';
import { MobileQuickNav } from './components/MobileQuickNav';
import { CheerGuideModal } from './components/CheerGuideModal';
import { MarqueeBanner } from './components/MarqueeBanner';
import { MarqueeSubmitModal } from './components/MarqueeSubmitModal';
import { tourData } from './data/tourData';
import { fetchAllSetlists, isSetlistConfigured } from './data/setlistApi';
import type { TourDate, Song } from './types';
import './App.css';

function App() {
  const [selectedTourDate, setSelectedTourDate] = useState<TourDate | null>(null);
  const [dynamicSetlists, setDynamicSetlists] = useState<Record<string, Song[]>>({});
  const [showCheerGuide, setShowCheerGuide] = useState(false);
  const [showMarqueeModal, setShowMarqueeModal] = useState(false);
  // SSR 안전: 초기값은 false, 클라이언트에서 체크
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Google Sheets에서 셋리스트 로드
  useEffect(() => {
    if (!isSetlistConfigured()) return;

    const loadSetlists = async () => {
      const setlists = await fetchAllSetlists();
      setDynamicSetlists(setlists);
    };

    loadSetlists();
  }, []);

  // 동적 셋리스트가 있으면 tourData와 병합
  const enrichedTourDates: TourDate[] = useMemo(() => {
    return tourData.tourDates.map((td) => {
      const dynamicSetlist = dynamicSetlists[td.city];
      // 시트에서 가져온 셋리스트가 있으면 우선 사용
      if (dynamicSetlist && dynamicSetlist.length > 0) {
        return { ...td, setlist: dynamicSetlist };
      }
      return td;
    });
  }, [dynamicSetlists]);

  const handleMarkerClick = (tourDate: TourDate) => {
    setSelectedTourDate(tourDate);
  };

  const handleCloseDetail = () => {
    setSelectedTourDate(null);
  };

  // 퀵 네비게이션용: 선택된 투어 기준으로 표시
  // 선택 전에는 모든 투어를 확인하여 셋리스트/트윗이 있는지 체크
  const hasAnySetlist = enrichedTourDates.some(td => td.setlist?.length > 0);
  const hasAnyTweets = enrichedTourDates.some(td => td.featuredTweets?.length > 0);

  if (isMobile) {
    return (
      <div className="app app--mobile">
        <Header
          bandName={tourData.bandName}
          tourName={tourData.tourName}
          year={tourData.year}
        />
        <MarqueeBanner />

        <main className="mobile-content">
          {/* 프로그레스 바 + 퀵 네비게이션 */}
          <section className="mobile-progress-section">
            <TourProgressBar
              tourDates={enrichedTourDates}
              selectedId={selectedTourDate?.id}
              onSelect={handleMarkerClick}
            />
            <MobileQuickNav
              hasSetlist={hasAnySetlist}
              hasTweets={hasAnyTweets}
              hasSelectedRegion={!!selectedTourDate}
              onCheerGuideClick={() => setShowCheerGuide(true)}
            />
          </section>

          {/* 공연 일정 섹션 - 칩 가로스크롤 */}
          <section id="schedule-section" className="mobile-schedule-section">
            <div className="mobile-schedule-chips">
              {enrichedTourDates.map((td) => {
                const isSelected = selectedTourDate?.id === td.id;
                const isPast = new Date(td.date) < new Date(new Date().toDateString());
                return (
                  <button
                    key={td.id}
                    className={`schedule-chip ${isSelected ? 'schedule-chip--selected' : ''} ${isPast ? 'schedule-chip--past' : ''}`}
                    onClick={() => handleMarkerClick(td)}
                  >
                    <span className="chip-city">{td.city}</span>
                    <span className="chip-date">{td.date.slice(5)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 상세 정보 또는 포스터 */}
          {selectedTourDate ? (
            <section id="detail-section" className="mobile-section">
              <DetailPanel
                tourDate={selectedTourDate}
                onClose={handleCloseDetail}
              />
            </section>
          ) : (
            <section className="mobile-poster-section">
              <TourPoster
                posterUrl={tourData.posterUrl}
                tourName={tourData.tourName}
              />
            </section>
          )}
        </main>

        {/* 플로팅 메시지 버튼 */}
        <button
          className="marquee-floating-btn"
          onClick={() => setShowMarqueeModal(true)}
          aria-label="메시지 작성"
        >
          💬
        </button>

        {showCheerGuide && (
          <CheerGuideModal onClose={() => setShowCheerGuide(false)} />
        )}

        {showMarqueeModal && (
          <MarqueeSubmitModal onClose={() => setShowMarqueeModal(false)} />
        )}
      </div>
    );
  }

  // 데스크탑 레이아웃
  return (
    <div className="app">
      <Header
        bandName={tourData.bandName}
        tourName={tourData.tourName}
        year={tourData.year}
      />
      <MarqueeBanner />

      <main className="main-content">
        <aside className="sidebar">
          <TourPoster
            posterUrl={tourData.posterUrl}
            tourName={tourData.tourName}
          />
          <TourList
            tourDates={enrichedTourDates}
            selectedId={selectedTourDate?.id}
            onSelect={handleMarkerClick}
            onCheerGuideClick={() => setShowCheerGuide(true)}
          />
        </aside>

        <section className="map-container">
          <TourMap
            tourDates={enrichedTourDates}
            onMarkerClick={handleMarkerClick}
            selectedId={selectedTourDate?.id}
          />
        </section>

        <aside className="detail-container">
          <DetailPanel
            tourDate={selectedTourDate}
            onClose={handleCloseDetail}
          />
        </aside>
      </main>

      {/* 플로팅 메시지 버튼 */}
      <button
        className="marquee-floating-btn"
        onClick={() => setShowMarqueeModal(true)}
        aria-label="메시지 작성"
      >
        💬
      </button>

      {showCheerGuide && (
        <CheerGuideModal onClose={() => setShowCheerGuide(false)} />
      )}

      {showMarqueeModal && (
        <MarqueeSubmitModal onClose={() => setShowMarqueeModal(false)} />
      )}
    </div>
  );
}

export default App;
