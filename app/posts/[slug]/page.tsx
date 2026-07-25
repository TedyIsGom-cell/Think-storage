import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { isValidSession } from '@/lib/auth';
import { formatDateTime } from '@/lib/format';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import LogoutButton from '../../components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });

  if (!post || !post.published) {
    notFound();
  }

  // 조회수 1 증가 (페이지를 열 때마다 카운트)
  const updated = await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  const sessionToken = cookies().get('admin_session')?.value;
  const isAdmin = await isValidSession(sessionToken);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-700">
          ← 목록으로
        </Link>
        {isAdmin && (
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/edit/${post.id}`}
              className="text-sm text-gray-400 hover:text-gray-700"
            >
              수정
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6">{post.category}</p>
      <h1 className="text-3xl font-bold mt-1 mb-2">{post.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
        <span>{formatDateTime(post.createdAt)}</span>
        <span>·</span>
        <span>조회 {updated.viewCount}</span>
      </div>

      <article className="whitespace-pre-wrap leading-relaxed text-[17px] mb-10">
        {post.content}
      </article>

      <LikeButton postId={post.id} initialCount={post.likeCount} />

      <CommentSection postId={post.id} isAdmin={isAdmin} />
    </main>
  );
}
