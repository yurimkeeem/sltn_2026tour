import { useMemo } from 'react';
import type { TourDate } from '../types';

interface TourProgressBarProps {
  tourDates: TourDate[];
  selectedId?: string;
  onSelect: (tourDate: TourDate) => void;
}

// 공연이 완료되었는지 확인 (오늘 이전)
function isPastConcert(dateString: string): boolean {
  const concertDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  concertDate.setHours(0, 0, 0, 0);
  return concertDate < today;
}

// 오늘이 공연일인지 확인
function isTodayConcert(dateString: string): boolean {
  const concertDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  concertDate.setHours(0, 0, 0, 0);
  return concertDate.getTime() === today.getTime();
}

// 다음 예정 공연 인덱스 찾기 (오늘 포함)
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
  // 날짜순 정렬 (메모이제이션)
  const sortedDates = useMemo(
    () => [...tourDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [tourDates]
  );

  const nextIndex = findNextUpcomingIndex(sortedDates);

  // 프로그레스 계산: 다음 공연 위치에 비행기 배치
  // 첫 공연 전이면 시작점, 모든 공연 완료면 끝점
  const progress = useMemo(() => {
    if (nextIndex === 0) return 0; // 첫 공연 전
    if (nextIndex >= sortedDates.length) return 100; // 모든 공연 완료
    // 마지막 완료 공연과 다음 공연 사이
    return ((nextIndex - 0.5) / sortedDates.length) * 100;
  }, [nextIndex, sortedDates.length]);

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
          const isToday = isTodayConcert(tourDate.date);
          const isSelected = selectedId === tourDate.id;
          const isNext = index === nextIndex;

          const classNames = [
            'progress-city',
            isPast ? 'progress-city--past' : '',
            isToday ? 'progress-city--today' : '',
            isSelected ? 'progress-city--selected' : '',
            isNext ? 'progress-city--next' : '',
          ].filter(Boolean).join(' ');

          return (
            <button
              key={tourDate.id}
              className={classNames}
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
