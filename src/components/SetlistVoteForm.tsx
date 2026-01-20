import { useState } from 'react';
import { discographyByAlbum } from '../data/discography';
import { submitVote } from '../data/voteStore';

interface SetlistVoteFormProps {
  tourDateId: string;
  city: string;
  maxSongs: number;
  onVoteSubmitted: () => void;
  onClose: () => void;
}

export function SetlistVoteForm({
  tourDateId,
  city,
  maxSongs,
  onVoteSubmitted,
  onClose,
}: SetlistVoteFormProps) {
  const [nickname, setNickname] = useState('');
  const [wantEmail, setWantEmail] = useState(false); // 메일 수신 여부
  const [email, setEmail] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false); // 개인정보 동의
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSongToggle = (song: string) => {
    setError('');
    if (selectedSongs.includes(song)) {
      setSelectedSongs(selectedSongs.filter((s) => s !== song));
    } else {
      if (selectedSongs.length >= maxSongs) {
        setError(`최대 ${maxSongs}곡까지 선택할 수 있어요!`);
        return;
      }
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요!');
      return;
    }

    if (selectedSongs.length === 0) {
      setError('최소 1곡 이상 선택해주세요!');
      return;
    }

    // 메일 수신 선택 시 이메일과 동의 필수
    if (wantEmail) {
      if (!email.trim()) {
        setError('이메일 주소를 입력해주세요!');
        return;
      }
      if (!privacyAgreed) {
        setError('개인정보 수집·이용에 동의해주세요!');
        return;
      }
    }

    setSubmitting(true);
    try {
      // 메일 수신 안 함 선택 시 테스트 이메일 사용
      const emailToSubmit = wantEmail ? email.trim() : 'no-reply@solutions-tour.local';
      await submitVote(tourDateId, nickname.trim(), selectedSongs, emailToSubmit);

      onVoteSubmitted();
    } catch (err) {
      setError('투표 제출 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vote-form-overlay">
      <div className="vote-form-modal">
        <button className="vote-form-close" onClick={onClose}>
          ✕
        </button>

        <form onSubmit={handleSubmit}>
          <header className="vote-form-header">
            <h2>🎵 {city} 셋리스트 맞추기</h2>
            <p>
              예상되는 셋리스트를 선택해주세요! (최대 <strong>{maxSongs}곡</strong>)
            </p>
          </header>

          <div className="vote-form-nickname">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
          </div>

          <div className="vote-form-email-option">
            <p className="vote-form-email-label">메일로 작성 내용 받기</p>
            <div className="vote-form-radio-group">
              <label className="vote-form-radio">
                <input
                  type="radio"
                  name="wantEmail"
                  checked={!wantEmail}
                  onChange={() => setWantEmail(false)}
                />
                <span>아니오</span>
              </label>
              <label className="vote-form-radio">
                <input
                  type="radio"
                  name="wantEmail"
                  checked={wantEmail}
                  onChange={() => setWantEmail(true)}
                />
                <span>예</span>
              </label>
            </div>
          </div>

          {wantEmail && (
            <div className="vote-form-email-section">
              <div className="vote-form-email">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력하세요"
                />
              </div>
              <label className="vote-form-privacy">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                />
                <span className="vote-form-privacy-text">
                  <strong>개인정보 수집·이용 동의 (필수)</strong>
                  <span className="vote-form-privacy-detail">
                    수집 항목: 이메일 | 수집 목적: 선택한 예상 셋리스트 폼 정보 발송 | 보유 기간: 메일 발송 이후 즉시 파기
                  </span>
                </span>
              </label>
            </div>
          )}

          <div className="vote-form-counter">
            선택: <strong>{selectedSongs.length}</strong>곡 (최대 {maxSongs}곡)
          </div>

          <div className="vote-form-songs">
            {Object.entries(discographyByAlbum).map(([album, songs]) => (
              <div key={album} className="vote-album-section">
                <h4 className="vote-album-title">{album}</h4>
                <div className="vote-song-grid">
                  {songs.map((song) => {
                    const isSelected = selectedSongs.includes(song);
                    const orderNum = isSelected
                      ? selectedSongs.indexOf(song) + 1
                      : null;
                    return (
                      <button
                        key={song}
                        type="button"
                        className={`vote-song-btn ${isSelected ? 'vote-song-btn--selected' : ''}`}
                        onClick={() => handleSongToggle(song)}
                      >
                        {orderNum && (
                          <span className="vote-song-order">{orderNum}</span>
                        )}
                        {song}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="vote-form-error">{error}</p>}

          <div className="vote-form-actions">
            <button
              type="submit"
              className="vote-submit-btn"
              disabled={selectedSongs.length === 0 || !nickname.trim() || submitting}
            >
              {submitting ? '제출 중...' : `투표하기 (${selectedSongs.length}곡)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
