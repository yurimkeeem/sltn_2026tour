// 알림장 데이터 - 곡별 응원법 및 떼창 가이드

export interface CheerLyric {
  text: string;
  highlight?: boolean; // 강조 컬러 (형광 yellow)
}

export interface CheerGuideItem {
  title: string;
  lyrics: CheerLyric[][];  // 줄별 가사 배열
  note?: string;  // 추가 메모
}

export const cheerGuideData: CheerGuideItem[] = [
  {
    title: 'Maximizer',
    lyrics: [
      [
        { text: '달려갔잖아 미친 척 따라했잖아' },
      ],
      [
        { text: '끝없이 춤을 추면 돼' },
      ],
      [
        { text: '뭘 하면 돼', highlight: true },
      ],
      [
        { text: '빨간 뭔가 속에 흘러 뭘까 이건' },
      ],
      [
        { text: '욕망 ' },
        { text: '절망', highlight: true },
        { text: ' 갈까 ' },
        { text: '말까', highlight: true },
      ],
    ],
  },
  {
    title: '문',
    lyrics: [
      [
        { text: '오지 않을까' },
      ],
      [
        { text: '되지 않을까' },
      ],
      [
        { text: '버려버릴까' },
      ],
      [
        { text: '벗어버릴까' },
      ],
      [
        { text: '뜯어버릴까', highlight: true },
      ],
      [],
      [
        { text: '머릴 숙일까' },
      ],
      [
        { text: '배를 가를까' },
      ],
      [
        { text: '묻어버릴까' },
      ],
      [
        { text: '뺏어버릴까', highlight: true },
      ],
      [
        { text: '나를 꺼낼까' },
      ],
      [
        { text: '미쳐버릴까' },
      ],
      [
        { text: '소릴 지를까!!!!!', highlight: true },
      ],
      [],
      [
        { text: '확' },
        { text: '(확!)', highlight: true },
        { text: ' 미쳐버리게' },
      ],
      [
        { text: '다 터져 나오게' },
      ],
      [
        { text: '널 더 흔들어놔' },
      ],
      [],
      [
        { text: '불' },
        { text: '(불!)', highlight: true },
        { text: ' 태워버리게' },
      ],
      [
        { text: '쏟아져 나오게' },
      ],
      [
        { text: '닫힌 문을 열어봐' },
      ],
    ],
  },
  {
    title: '혼',
    lyrics: [
      [
        { text: '거룩한 이여' },
      ],
      [
        { text: '부서진 내 혼이여' },
      ],
      [
        { text: '생의 춤이 끝나기 전에', highlight: true },
      ],
      [
        { text: '헝클어진 내 운명의 목마름을 씻어주오' },
      ],
      [
        { text: '밤새 기도한 이여' },
      ],
      [
        { text: '길 잃은 내 혼이여' },
      ],
      [
        { text: '생의 불이 꺼지기 전에', highlight: true },
      ],
      [
        { text: '이 꿈에서 날 깨워주오' },
      ],
    ],
    note: '기타 솔로 시작 전까지 Hey! 반복',
  },
];

// 영상 출처 정보
export const cheerGuideMedia = {
  videoUrl: 'https://x.com/nomusicno1ife/status/2013253893162234028/video/1',
  tweetUrl: 'https://x.com/nomusicno1ife/status/2013253893162234028',
  credit: 'twitter @nomusicno1ife',
};
