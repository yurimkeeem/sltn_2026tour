# Google Forms + Sheets 연동 가이드

이 가이드를 따라하면 투표 데이터를 무료로 저장하고 공유할 수 있어요!

## 1단계: Google Form 만들기

1. [Google Forms](https://forms.google.com) 접속
2. **새 양식 만들기** 클릭
3. 양식 제목: `솔루션스 투어 셋리스트 투표`

### 필드 추가하기:

| 필드 이름 | 유형 | 설명 |
|-----------|------|------|
| tourDateId | 단답형 | 공연 ID (예: incheon-1) |
| nickname | 단답형 | 닉네임 |
| songs | 단답형 | 선택한 곡들 (쉼표로 구분) |

4. 우측 상단 **⚙️ 설정** 클릭
5. **응답** 탭 → "응답을 스프레드시트로 수집" 활성화

## 2단계: Google Sheets 공개 설정

1. 연결된 Google Sheets 열기
2. **파일** → **공유** → **웹에 게시**
3. **게시** 클릭
4. **공유** → **링크가 있는 모든 사용자** → **뷰어** 선택

## 3단계: Sheets ID 복사

Sheets URL에서 ID 부분 복사:
```
https://docs.google.com/spreadsheets/d/[이 부분이 SHEET_ID]/edit
```

## 4단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
VITE_GOOGLE_SHEET_ID=여기에_SHEET_ID_붙여넣기
VITE_GOOGLE_FORM_ID=여기에_FORM_ID_붙여넣기
```

Form ID는 Form URL에서 확인:
```
https://docs.google.com/forms/d/e/[이 부분이 FORM_ID]/viewform
```

## 5단계: 완료!

이제 앱에서 투표하면:
1. Google Form으로 데이터 전송
2. Google Sheets에 자동 저장
3. 앱에서 Sheets 데이터를 읽어와 결과 표시

---

## 주의사항

- Google Sheets가 **공개**되어야 데이터를 읽을 수 있어요
- Form 응답은 실시간으로 Sheets에 반영됩니다
- 무료 사용에 제한 없음!

## 문제 해결

### "CORS 에러" 발생 시
- Sheets가 웹에 게시되었는지 확인
- Sheet ID가 올바른지 확인

### 데이터가 안 보일 때
- Sheets 첫 행이 헤더인지 확인 (타임스탬프, tourDateId, nickname, songs)
- 최소 1개 이상의 응답이 있어야 함
