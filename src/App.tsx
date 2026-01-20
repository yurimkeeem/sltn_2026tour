import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TourMap } from './components/TourMap';
import { TourList } from './components/TourList';
import { DetailPanel } from './components/DetailPanel';
import { TourPoster } from './components/TourPoster';
import { TourProgressBar } from './components/TourProgressBar';
import { MobileQuickNav } from './components/MobileQuickNav';
import { tourData } from './data/tourData';
import type { TourDate } from './types';
import './App.css';

function App() {
  const [selectedTourDate, setSelectedTourDate] = useState<TourDate | null>(null);
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

  const handleMarkerClick = (tourDate: TourDate) => {
    setSelectedTourDate(tourDate);
  };

  const handleCloseDetail = () => {
    setSelectedTourDate(null);
  };

  // 퀵 네비게이션용: 선택된 투어 기준으로 표시
  // 선택 전에는 모든 투어를 확인하여 셋리스트/트윗이 있는지 체크
  const hasAnySetlist = tourData.tourDates.some(td => td.setlist?.length > 0);
  const hasAnyTweets = tourData.tourDates.some(td => td.featuredTweets?.length > 0);

  if (isMobile) {
    return (
      <div className="app app--mobile">
        <Header
          bandName={tourData.bandName}
          tourName={tourData.tourName}
          year={tourData.year}
        />

        <main className="mobile-content">
          {/* 프로그레스 바 + 퀵 네비게이션 */}
          <section className="mobile-progress-section">
            <TourProgressBar
              tourDates={tourData.tourDates}
              selectedId={selectedTourDate?.id}
              onSelect={handleMarkerClick}
            />
            <MobileQuickNav hasSetlist={hasAnySetlist} hasTweets={hasAnyTweets} />
          </section>

          {/* 공연 일정 섹션 - 칩 가로스크롤 */}
          <section id="schedule-section" className="mobile-schedule-section">
            <div className="mobile-schedule-chips">
              {tourData.tourDates.map((td) => {
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

      <main className="main-content">
        <aside className="sidebar">
          <TourPoster
            posterUrl={tourData.posterUrl}
            tourName={tourData.tourName}
          />
          <TourList
            tourDates={tourData.tourDates}
            selectedId={selectedTourDate?.id}
            onSelect={handleMarkerClick}
          />
        </aside>

        <section className="map-container">
          <TourMap
            tourDates={tourData.tourDates}
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
    </div>
  );
}

export default App;
