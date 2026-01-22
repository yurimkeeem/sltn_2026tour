import { useEffect, useState } from 'react';
import { getVoteResults, getTotalVoters } from '../data/voteStore';
import type { SongVoteResult, Song } from '../types';

interface SetlistPredictionProps {
  tourDateId: string;
  maxSongs: number;
  actualSetlist?: Song[]; // 실제 셋리스트 (공연 완료 시)
}

export function SetlistPrediction({
  tourDateId,
  maxSongs,
  actualSetlist,
}: SetlistPredictionProps) {
  // 실제 셋리스트 곡 제목 Set (비교용)
  const actualSongTitles = new Set(
    actualSetlist?.map((song) => song.title.toLowerCase()) || []
  );
  const isInActualSetlist = (title: string) =>
    actualSongTitles.size > 0 && actualSongTitles.has(title.toLowerCase());
  const [results, setResults] = useState<SongVoteResult[]>([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const [voteResults, voters] = await Promise.all([
          getVoteResults(tourDateId),
          getTotalVoters(tourDateId),
        ]);
        setResults(voteResults);
        setTotalVoters(voters);
      } catch (error) {
        console.error('Failed to load vote results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
    // 10초마다 결과 갱신 (Google Sheets는 너무 자주 호출하면 안 됨)
    const interval = setInterval(loadResults, 10000);
    return () => clearInterval(interval);
  }, [tourDateId]);

  if (loading) {
    return (
      <div className="prediction-loading">
        <p>투표 결과 불러오는 중...</p>
      </div>
    );
  }

  if (totalVoters === 0) {
    return (
      <div className="prediction-empty">
        <p>아직 투표한 팬이 없어요!</p>
        <p>첫 번째로 셋리스트를 예측해보세요 🎵</p>
      </div>
    );
  }

  const topSongs = results.slice(0, maxSongs);

  return (
    <div className="prediction-section">
      <h4>📊 팬 예상 셋리스트</h4>
      <p className="prediction-voters">
        총 <strong>{totalVoters}명</strong>이 참여했어요!
      </p>

      <ol className="prediction-list">
        {topSongs.map((song, index) => {
          const matched = isInActualSetlist(song.title);
          return (
            <li key={song.title} className={`prediction-item ${matched ? 'prediction-item--matched' : ''}`}>
              <span className="prediction-rank">{index + 1}</span>
              <div className="prediction-song-info">
                <span className={`prediction-song-title ${matched ? 'prediction-song-title--matched' : ''}`}>{song.title}</span>
                <div className="prediction-bar-container">
                  <div
                    className="prediction-bar"
                    style={{ width: `${song.percentage}%` }}
                  />
                </div>
              </div>
              <span className="prediction-percentage">{song.percentage}%</span>
            </li>
          );
        })}
      </ol>

      {results.length > maxSongs && (
        <details className="prediction-more">
          <summary>전체 득표 현황 보기</summary>
          <ol className="prediction-list prediction-list--full" start={maxSongs + 1}>
            {results.slice(maxSongs).map((song, index) => {
              const matched = isInActualSetlist(song.title);
              return (
                <li key={song.title} className={`prediction-item prediction-item--small ${matched ? 'prediction-item--matched' : ''}`}>
                  <span className="prediction-rank">{maxSongs + index + 1}</span>
                  <span className={`prediction-song-title ${matched ? 'prediction-song-title--matched' : ''}`}>{song.title}</span>
                  <span className="prediction-percentage">{song.percentage}%</span>
                </li>
              );
            })}
          </ol>
        </details>
      )}
    </div>
  );
}
