import type { TourDate } from '../types';

interface TourListProps {
  tourDates: TourDate[];
  selectedId?: string;
  onSelect: (tourDate: TourDate) => void;
  onCheerGuideClick?: () => void;
}

export function TourList({ tourDates, selectedId, onSelect, onCheerGuideClick }: TourListProps) {
  return (
    <div className="tour-list">
      <h3 className="tour-list-title">📍 공연 일정</h3>
      <ul className="tour-list-items">
        {tourDates.map((tourDate) => (
          <li
            key={tourDate.id}
            className={`tour-list-item ${selectedId === tourDate.id ? 'tour-list-item--selected' : ''}`}
            onClick={() => onSelect(tourDate)}
          >
            <span className="tour-list-city">{tourDate.city}</span>
            <span className="tour-list-date">{tourDate.date}</span>
          </li>
        ))}
      </ul>
      {onCheerGuideClick && (
        <button className="cheer-guide-btn" onClick={onCheerGuideClick}>
          <span>📣</span> 알림장
        </button>
      )}
    </div>
  );
}
