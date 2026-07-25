import crypto from 'crypto';

// .env 파일의 ADMIN_SECRET 값을 이용해 세션 토큰을 만들고 검증합니다.
// (ADMIN_PASSWORD는 로그인할 때 입력하는 비밀번호, ADMIN_SECRET은 내부적으로
// 로그인 상태를 안전하게 유지하기 위한 별도의 비밀 값입니다.)

const SECRET = process.env.ADMIN_SECRET || 'please-change-this-secret';

export function createSessionToken(): string {
  return crypto.createHmac('sha256', SECRET).update('admin-session').digest('hex');
}

export function isValidSession(token: string | undefined | null): boolean {
  if (!token) return false;
  return token === createSessionToken();
}

// 게스트 댓글 비밀번호는 원문을 저장하지 않고 해시로 저장합니다.
export function hashCommentPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function getSessionTokenFromRequest(req: Request): string | undefined {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  return match ? match[1] : undefined;
}
