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
  const [isMobile, setIsMobile] = useState(false);

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

  // 모바일에서 선택된 투어 또는 첫 번째 투어의 정보 확인
  const currentTour = selectedTourDate || tourData.tourDates[0];
  const hasSetlist = currentTour?.setlist?.length > 0;
  const hasTweets = currentTour?.featuredTweets?.length > 0;

  if (isMobile) {
    return (
      <div className="app app--mobile">
        <Header
          bandName={tourData.bandName}
          tourName={tourData.tourName}
          year={tourData.year}
        />

        <MobileQuickNav hasSetlist={hasSetlist} hasTweets={hasTweets} />

        <main className="mobile-content">
          {/* 프로그레스 바 */}
          <section className="mobile-progress-section">
            <TourProgressBar
              tourDates={tourData.tourDates}
              selectedId={selectedTourDate?.id}
              onSelect={handleMarkerClick}
            />
          </section>

          {/* 공연 일정 섹션 */}
          <section id="schedule-section" className="mobile-section">
            <h2 className="mobile-section-title">공연 일정</h2>
            <TourList
              tourDates={tourData.tourDates}
              selectedId={selectedTourDate?.id}
              onSelect={handleMarkerClick}
            />
          </section>

          {/* 상세 정보 */}
          {selectedTourDate && (
            <section id="detail-section" className="mobile-section">
              <DetailPanel
                tourDate={selectedTourDate}
                onClose={handleCloseDetail}
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
