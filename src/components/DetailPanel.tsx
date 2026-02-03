import { useState } from 'react';
import type { TourDate } from '../types';
import { SetlistDisplay } from './SetlistDisplay';
import { PlaylistLinks } from './PlaylistLinks';
import { TweetPreview } from './TweetPreview';
import { SetlistVoteForm } from './SetlistVoteForm';
import { SetlistPrediction } from './SetlistPrediction';
import { CheerGuideModal } from './CheerGuideModal';

interface DetailPanelProps {
  tourDate: TourDate | null;
  onClose: () => void;
}

// 공연이 아직 진행되지 않았는지 확인
function isUpcoming(dateString: string): boolean {
  const concertDate = new Date(dateString);
  const today = new Date();
  // 시간 제거하고 날짜만 비교
  today.setHours(0, 0, 0, 0);
  concertDate.setHours(0, 0, 0, 0);
  return concertDate > today;
}

type TabType = 'setlist' | 'prediction';

export function DetailPanel({ tourDate, onClose }: DetailPanelProps) {
  const [showVoteForm, setShowVoteForm] = useState(false);
  const [showCheerGuide, setShowCheerGuide] = useState(false);
  const [voteKey, setVoteKey] = useState(0); // 투표 결과 갱신용
  const [activeTab, setActiveTab] = useState<TabType>('setlist'); // 탭 상태

  if (!tourDate) {
    return (
      <div className="detail-panel detail-panel--empty">
        <div className="empty-state">
          <span className="empty-icon">🗺️</span>
          <p>지도에서 공연 지역을 선택해주세요</p>
        </div>
      </div>
    );
  }

  const upcoming = isUpcoming(tourDate.date);
  const defaultSetlistSize = tourDate.expectedSetlistSize || 8;

  const handleVoteSubmitted = () => {
    setShowVoteForm(false);
    setVoteKey((k) => k + 1); // 결과 갱신
  };

  return (
    <div className="detail-panel">
      <button className="close-button" onClick={onClose}>
        ✕
      </button>

      <header className="detail-header">
        <h2 className="detail-city">{tourDate.city}</h2>
        <p className="detail-venue">{tourDate.venue}</p>
        <p className="detail-date">
          📅 {tourDate.date}
          {upcoming && <span className="upcoming-badge">예정</span>}
        </p>
      </header>

      {/* 티켓 구매 링크 (예정 공연만) */}
      {upcoming && tourDate.ticketLink && (
        <div className="ticket-link-section">
          <a
            href={tourDate.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-button"
          >
            🎫 공연 예매하기
          </a>
        </div>
      )}

      <div className="detail-content">
        {upcoming ? (
          // 공연 예정: 투표 기능
          <>
            <div id="setlist-section" className="vote-section">
              <button
                className="vote-open-btn"
                onClick={() => setShowVoteForm(true)}
              >
                🎵 셋리스트 맞추기
              </button>
              <p className="vote-description">
                이 공연의 셋리스트를 예측하고<br />다른 팬들과 비교해 보세요!
              </p>
            </div>

            <SetlistPrediction
              key={voteKey}
              tourDateId={tourDate.id}
              maxSongs={defaultSetlistSize}
            />
          </>
        ) : (
          // 공연 완료: 탭으로 셋리스트 / 예측 결과 전환
          <>
            <div className="detail-tabs">
              <button
                className={`detail-tab ${activeTab === 'setlist' ? 'detail-tab--active' : ''}`}
                onClick={() => setActiveTab('setlist')}
              >
                셋리스트
              </button>
              <button
                className={`detail-tab ${activeTab === 'prediction' ? 'detail-tab--active' : ''}`}
                onClick={() => setActiveTab('prediction')}
              >
                예측 결과
              </button>
            </div>

            {activeTab === 'setlist' ? (
              <>
                <div id="setlist-section">
                  <SetlistDisplay setlist={tourDate.setlist} />
                </div>
                <PlaylistLinks links={tourDate.playlistLinks} />
                <div id="tweets-section">
                  <TweetPreview tweets={tourDate.featuredTweets} />
                </div>
              </>
            ) : (
              <SetlistPrediction
                key={voteKey}
                tourDateId={tourDate.id}
                maxSongs={defaultSetlistSize}
                actualSetlist={tourDate.setlist}
              />
            )}
          </>
        )}
      </div>

      {showVoteForm && (
        <SetlistVoteForm
          tourDateId={tourDate.id}
          city={tourDate.city}
          maxSongs={defaultSetlistSize}
          onVoteSubmitted={handleVoteSubmitted}
          onClose={() => setShowVoteForm(false)}
        />
      )}

      {showCheerGuide && (
        <CheerGuideModal onClose={() => setShowCheerGuide(false)} />
      )}
    </div>
  );
}
