# 내 블로그

텍스트 중심의 개인 블로그입니다. 관리자 페이지에 로그인해서 웹 화면에서 바로 글을 쓰고 발행할 수 있습니다.

## 구조
- **Next.js** — 웹사이트 프레임워크
- **Vercel Postgres** — 글이 저장되는 데이터베이스
- **관리자 로그인** — 비밀번호 하나로 보호되는 글쓰기 화면 (`/admin`)

## 기능
- 조회수 / 좋아요 (좋아요는 브라우저 기준으로 중복 방지)
- 댓글: 누구나 이름 + 비밀번호 + 내용으로 작성 가능. **수정/삭제는 관리자만** 가능
  (관리자로 로그인한 상태에서 글 페이지에 들어가면 각 댓글에 "수정"/"삭제" 버튼이 보입니다)
- 메인 화면 상단 "인기 게시물" 3칸 (조회수 기준)
- 글 검색 (제목 + 본문 내용 검색, `/search?q=검색어`)
- 게시물 수정 / 삭제 (관리자 전용, `/admin/edit/[글번호]`)
- 카테고리: 글쓰기 화면에서 카테고리를 입력하면, 메인 화면 왼쪽에 카테고리별로 모아서 볼 수 있어요
- 로그인 / 로그아웃 (우측 상단)
- 업데이트 기록 페이지 (우측 상단 "업데이트 기록" 버튼)
- 글/댓글 작성 시각을 초 단위까지 표시

> ⚠️ 이번 업데이트로 데이터베이스에 컬럼 2개가 추가되었어요. 아래 "데이터베이스에 반영하기" 섹션의
> SQL을 실행해주셔야 정상 작동합니다.

## 처음 실행하기까지 순서 (하나도 안 빠뜻하고 그대로 따라하시면 됩니다)

### 1. GitHub에 코드 올리기
1. https://github.com 에서 계정을 만드세요 (이미 있으면 생략).
2. 새 저장소(Repository)를 하나 만드세요. 이름은 자유 (예: `my-blog`).
3. 이 프로젝트 폴더 전체를 그 저장소에 업로드하세요.
   - GitHub Desktop 앱을 쓰면 드래그 앤 드롭처럼 쉽게 올릴 수 있습니다: https://desktop.github.com

### 2. Vercel에 배포하기
1. https://vercel.com 에서 GitHub 계정으로 로그인하세요.
2. "Add New... → Project"를 누르고, 방금 올린 GitHub 저장소를 선택하세요.
3. "Deploy" 버튼을 누르면 자동으로 배포가 시작됩니다. (이 단계에서는 아직 데이터베이스가 없어서 에러가 날 수 있어요. 다음 단계로 이어서 해결합니다.)

### 3. 데이터베이스 연결하기 (Vercel Postgres)
1. Vercel 프로젝트 화면에서 "Storage" 탭 → "Create Database" → "Postgres" 선택.
2. 만들고 나면 "Connect Project"를 눌러서 방금 만든 블로그 프로젝트에 연결하세요.
   - 이 과정에서 `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` 같은 환경변수가 **자동으로** 채워집니다.
3. 프로젝트 "Settings → Environment Variables"에서 아래 2개를 직접 추가하세요:
   - `ADMIN_PASSWORD` : 관리자 페이지 로그인 비밀번호 (원하는 걸로 정하세요)
   - `ADMIN_SECRET` : 아무 긴 문자열 (예: `a8f7s6d5f4a3s2d1`)
4. 데이터베이스에 테이블을 만들어야 합니다. 터미널(컴퓨터의 명령 프롬프트)에서:
   ```
   npx vercel env pull .env
   npx prisma db push
   ```
   (`vercel` CLI가 없다면 먼저 `npm i -g vercel`로 설치 후 `vercel login`을 해주세요.)
5. Vercel 프로젝트 화면에서 "Redeploy"를 눌러 다시 배포하세요.

### 4. 사용하기
- 배포된 주소 + `/admin` 으로 들어가서 비밀번호(ADMIN_PASSWORD로 정한 값)를 입력하면 글쓰기 화면이 나옵니다.
- 글을 쓰고 "발행하기"를 누르면 즉시 홈 화면에 나타납니다.

## 로컬(내 컴퓨터)에서 미리보기 하고 싶다면
```
npm install
npx vercel env pull .env    # Vercel의 환경변수를 내 컴퓨터로 가져오기
npx prisma db push          # 데이터베이스 테이블 생성
npm run dev                 # http://localhost:3000 에서 확인
```

> ⚠️ 데이터베이스 구조(prisma/schema.prisma)가 바뀌었습니다.
> Vercel **Storage → 데이터베이스 → Query** 탭 (또는 "Open in Neon" → SQL Editor)에서
> 아래 SQL을 **하나씩 따로** 실행해주세요.

```sql
ALTER TABLE "Post" ADD COLUMN category TEXT NOT NULL DEFAULT '일반';
```

```sql
ALTER TABLE "Comment" ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT now();
```

## 나중에 더 해볼 수 있는 것들
- 마크다운 문법 지원 (굵게, 기울임 등)
- 다크 모드
- 댓글 좋아요, 답글(대댓글)
- 카테고리별 페이지 디자인 개선, 카테고리 드롭다운 선택
