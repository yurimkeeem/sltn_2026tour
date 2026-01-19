import type { TourDate } from '../types';

interface TourProgressBarProps {
  tourDates: TourDate[];
  selectedId?: string;
  onSelect: (tourDate: TourDate) => void;
}

function isPastConcert(dateString: string): boolean {
  const concertDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  concertDate.setHours(0, 0, 0, 0);
  return concertDate < today;
}

function findNextUpcomingIndex(tourDates: TourDate[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < tourDates.length; i++) {
    const d = new Date(tourDates[i].date);
    d.setHours(0, 0, 0, 0);
    if (d >= today) {
      return i;
    }
  }
  return tourDates.length; // 모든 공연 완료
}

export function TourProgressBar({ tourDates, selectedId, onSelect }: TourProgressBarProps) {
  // 날짜순 정렬
  const sortedDates = [...tourDates].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const nextIndex = findNextUpcomingIndex(sortedDates);
  const progress = nextIndex > 0 ? ((nextIndex - 0.5) / sortedDates.length) * 100 : 5;

  return (
    <div className="tour-progress-bar">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <div className="progress-airplane" style={{ left: `${progress}%` }}>
          ✈️
        </div>
      </div>
      <div className="progress-cities">
        {sortedDates.map((tourDate, index) => {
          const isPast = isPastConcert(tourDate.date);
          const isSelected = selectedId === tourDate.id;
          const isNext = index === nextIndex;

          return (
            <button
              key={tourDate.id}
              className={`progress-city ${isPast ? 'progress-city--past' : ''} ${isSelected ? 'progress-city--selected' : ''} ${isNext ? 'progress-city--next' : ''}`}
              onClick={() => onSelect(tourDate)}
            >
              <span className="progress-city-dot" />
              <span className="progress-city-name">{tourDate.city}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
