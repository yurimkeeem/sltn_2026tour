import { useState } from 'react';
import { Header } from './components/Header';
import { TourMap } from './components/TourMap';
import { TourList } from './components/TourList';
import { DetailPanel } from './components/DetailPanel';
import { tourData } from './data/tourData';
import type { TourDate } from './types';
import './App.css';

function App() {
  const [selectedTourDate, setSelectedTourDate] = useState<TourDate | null>(null);

  const handleMarkerClick = (tourDate: TourDate) => {
    setSelectedTourDate(tourDate);
  };

  const handleCloseDetail = () => {
    setSelectedTourDate(null);
  };

  return (
    <div className="app">
      <Header
        bandName={tourData.bandName}
        tourName={tourData.tourName}
        year={tourData.year}
      />

      <main className="main-content">
        <aside className="sidebar">
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
