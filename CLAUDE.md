# 솔루션스 2026 투어 웹사이트

## 프로젝트 개요
솔루션스 밴드의 2026 전국투어 정보를 제공하는 팬 페이지입니다.

## 기술 스택
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (App.css)
- **배포**: Vercel (GitHub 연동 자동 배포)
- **외부 연동**: Google Sheets API (읽기 전용)

## 폴더 구조
```
src/
├── components/       # UI 컴포넌트
│   ├── Header.tsx
│   ├── TourMap.tsx         # 한국 지도 + 마커
│   ├── TourList.tsx        # 공연 일정 목록
│   ├── DetailPanel.tsx     # 상세 정보 패널
│   ├── SetlistDisplay.tsx  # 셋리스트 표시 (2열)
│   ├── SetlistPrediction.tsx  # 팬 예측 결과
│   ├── SetlistVoteForm.tsx # 투표 폼
│   ├── MarqueeBanner.tsx   # 전광판 배너
│   ├── MarqueeSubmitModal.tsx
│   ├── CheerGuideModal.tsx # 응원법 모달
│   └── ...
├── data/
│   ├── tourData.ts         # 투어 일정 하드코딩 데이터
│   ├── setlistApi.ts       # 셋리스트 Google Sheets 연동
│   ├── marqueeApi.ts       # 전광판 Google Sheets 연동
│   └── voteStore.ts        # 투표 데이터 관리
├── types/
│   └── index.ts            # TypeScript 타입 정의
├── App.tsx                 # 메인 앱 (모바일/데스크탑 분기)
└── App.css                 # 전역 스타일
```

## 주요 기능
1. **공연 일정**: 6개 도시 투어 정보 (춘천, 전주, 부산, 대구, 대전, 서울)
2. **지도**: SVG 한국 지도에 마커 표시
3. **셋리스트**: Google Sheets 연동, 실시간 업데이트
4. **전광판**: 팬 메시지 표시, Google Forms로 수집
5. **투표**: 셋리스트 예측 투표

## 환경변수
```env
# 투표 시트/폼
VITE_GOOGLE_SHEETS_ID=xxx
VITE_GOOGLE_FORMS_ID=xxx

# 전광판 시트/폼
VITE_MARQUEE_SHEET_ID=xxx
VITE_MARQUEE_FORM_ID=xxx

# 셋리스트 시트
VITE_SETLIST_SHEET_ID=xxx
```

> ⚠️ Vercel 배포 시 환경변수 별도 설정 필요 (Settings → Environment Variables)

## Google Sheets 구조

### 셋리스트 시트
| A (춘천) | B (전주) | C (부산) | D (대구) | E (대전) | F (서울) |
|---------|---------|---------|---------|---------|---------|
| 춘천    | 전주    | 부산    | 대구    | 대전    | 서울    |
| 곡1     | 곡1     | 곡1     | ...     | ...     | ...     |
| 곡2     | 곡2     | ...     |         |         |         |

- 첫 행은 헤더 (자동 스킵)
- 커버곡: `곡명 (Cover: 아티스트)` 형식

### 전광판 시트
| A (타임스탬프) | B (메시지) | C (닉네임) |
|--------------|-----------|-----------|
| 2025-01-25   | 화이팅!   | 팬1       |

## 자주 쓰는 명령어
```bash
npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
git push         # Vercel 자동 배포 트리거
```

## 디자인 시스템

### 색상
- 배경: `#0a0a0a`
- 텍스트: `#ffffff`
- 서브텍스트: `#888888`
- 보더: `#333333`
- 강조 (네온): `#ff6b6b`, `#4ecdc4`, `#ffd93d`, `#6bcb77`, `#9b59b6`

### 반응형
- 모바일: `≤768px` (세로 레이아웃)
- 데스크탑: `>768px` (3단 레이아웃)

## 코딩 컨벤션
- 컴포넌트: PascalCase (`TourMap.tsx`)
- 함수/변수: camelCase
- 상수: UPPER_SNAKE_CASE
- 주석: 한글 OK
- 들여쓰기: 2칸

## 주의사항
- `.env` 파일 커밋 금지 (`.gitignore`에 포함)
- Google Sheets는 **공개** 설정 필요
- 셋리스트 2열 표시: 1-10곡 1열, 11곡~ 2열
