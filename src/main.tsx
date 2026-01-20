import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { clearAllLocalVotes, clearLocalVotes } from './data/voteStore'

// 개발/디버그용: 브라우저 콘솔에서 로컬 투표 데이터 초기화 가능
// 사용법: window.resetVotes() 또는 window.resetVotes('jeonju-1')
if (typeof window !== 'undefined') {
  (window as Window & { resetVotes?: (tourDateId?: string) => void }).resetVotes = (tourDateId?: string) => {
    if (tourDateId) {
      clearLocalVotes(tourDateId);
      console.log(`${tourDateId} 투표 데이터가 초기화되었습니다.`);
    } else {
      clearAllLocalVotes();
      console.log('모든 로컬 투표 데이터가 초기화되었습니다.');
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
