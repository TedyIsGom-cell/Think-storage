import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isValidSession } from '@/lib/auth';

function getTokenFromRequest(req: Request): string | undefined {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  return match ? match[1] : undefined;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(req);
  if (!isValidSession(token)) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { title, content, published } = await req.json();
  const post = await prisma.post.update({
    where: { id: Number(params.id) },
    data: { title, content, published },
  });

  return NextResponse.json(post);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(req);
  if (!isValidSession(token)) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  await prisma.post.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
