import type { SetlistVote, SongVoteResult } from '../types';
import {
  fetchVoteResults,
  fetchTotalVoters,
  submitVoteToForm,
  isGoogleSheetsConfigured,
  isGoogleFormConfigured,
} from './googleSheetsApi';

// 로컬 스토리지 기반 투표 저장소 (Google Sheets 미설정 시 폴백)
const STORAGE_KEY = 'solutions-tour-votes';

// ============================================
// 로컬 스토리지 함수들 (폴백용)
// ============================================

function getAllVotesLocal(): Record<string, SetlistVote[]> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function getVotesForTourDateLocal(tourDateId: string): SetlistVote[] {
  const allVotes = getAllVotesLocal();
  return allVotes[tourDateId] || [];
}

function submitVoteLocal(
  tourDateId: string,
  odepourNickname: string,
  selectedSongs: string[]
): SetlistVote {
  const allVotes = getAllVotesLocal();

  const newVote: SetlistVote = {
    odepourId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    odepourNickname,
    selectedSongs,
    votedAt: new Date().toISOString(),
  };

  if (!allVotes[tourDateId]) {
    allVotes[tourDateId] = [];
  }

  allVotes[tourDateId].push(newVote);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allVotes));

  return newVote;
}

function getVoteResultsLocal(tourDateId: string): SongVoteResult[] {
  const votes = getVotesForTourDateLocal(tourDateId);

  if (votes.length === 0) return [];

  const songCounts: Record<string, number> = {};

  votes.forEach((vote) => {
    vote.selectedSongs.forEach((song) => {
      songCounts[song] = (songCounts[song] || 0) + 1;
    });
  });

  return Object.entries(songCounts)
    .map(([title, voteCount]) => ({
      title,
      voteCount,
      percentage: Math.round((voteCount / votes.length) * 100),
    }))
    .sort((a, b) => b.voteCount - a.voteCount);
}

function getTotalVotersLocal(tourDateId: string): number {
  return getVotesForTourDateLocal(tourDateId).length;
}

// ============================================
// 공개 API (Google Sheets 또는 로컬 자동 선택)
// ============================================

// 투표 결과 집계하기 (비동기)
export async function getVoteResults(tourDateId: string): Promise<SongVoteResult[]> {
  if (isGoogleSheetsConfigured()) {
    return fetchVoteResults(tourDateId);
  }
  return getVoteResultsLocal(tourDateId);
}

// 총 투표 참여자 수 (비동기)
export async function getTotalVoters(tourDateId: string): Promise<number> {
  if (isGoogleSheetsConfigured()) {
    return fetchTotalVoters(tourDateId);
  }
  return getTotalVotersLocal(tourDateId);
}

// 투표 제출하기 (비동기)
export async function submitVote(
  tourDateId: string,
  odepourNickname: string,
  selectedSongs: string[]
): Promise<SetlistVote> {
  const newVote: SetlistVote = {
    odepourId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    odepourNickname,
    selectedSongs,
    votedAt: new Date().toISOString(),
  };

  // Google Form이 설정되어 있으면 Form으로 제출
  if (isGoogleFormConfigured()) {
    await submitVoteToForm(tourDateId, odepourNickname, selectedSongs);
  }

  // 로컬에도 저장 (즉시 확인용)
  submitVoteLocal(tourDateId, odepourNickname, selectedSongs);

  return newVote;
}

// 내 투표 확인 (닉네임 기준) - 로컬만 확인
export function getMyVote(
  tourDateId: string,
  odepourNickname: string
): SetlistVote | null {
  const votes = getVotesForTourDateLocal(tourDateId);
  return votes.find((v) => v.odepourNickname === odepourNickname) || null;
}

// Google Sheets 설정 상태 확인
export { isGoogleSheetsConfigured, isGoogleFormConfigured };
