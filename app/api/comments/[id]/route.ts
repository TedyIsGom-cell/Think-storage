import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isValidSession, getSessionTokenFromRequest } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const token = getSessionTokenFromRequest(req);
  if (!isValidSession(token)) {
    return NextResponse.json({ error: '관리자만 삭제할 수 있습니다.' }, { status: 401 });
  }

  await prisma.comment.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
