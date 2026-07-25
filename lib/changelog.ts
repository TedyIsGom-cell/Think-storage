export type ChangelogEntry = {
  date: string; // YYYY-MM-DD
  description: string;
};

export const changelog: ChangelogEntry[] = [
  {
    date: '2026-07-25',
    description: '카테고리 페이지에 "전체 텍스트로 다운로드" 기능 추가 (같은 카테고리 글을 하나의 텍스트 파일로 묶어서 다운로드)',
  },
  {
    date: '2026-07-25',
    description:
      '블로그 이름을 "이산의 블로그"로 변경, 게시물/댓글 수정·삭제 기능 추가, 로그인/로그아웃 기능 추가, 카테고리 기능 추가, 업데이트 기록 페이지 추가, 게시물·댓글 작성 시각을 초 단위까지 표시',
  },
  {
    date: '2026-07-25',
    description: '조회수, 좋아요, 댓글(게스트 작성/관리자 삭제) 기능 추가, 인기 게시물 3개 노출, 글 검색 기능 추가',
  },
  {
    date: '2026-07-25',
    description: '블로그 최초 생성: 글 목록, 글 상세, 관리자 로그인 후 글쓰기 기능',
  },
];
