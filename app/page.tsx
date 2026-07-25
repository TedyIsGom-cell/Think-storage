import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [posts, popularPosts] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { viewCount: 'desc' },
      take: 3,
    }),
  ]);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">내 글 모음</h1>
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-700">
          관리자
        </Link>
      </div>

      <form action="/search" className="mb-12">
        <input
          type="text"
          name="q"
          placeholder="글 검색하기..."
          className="w-full border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </form>

      {popularPosts.length > 0 && (
        <div className="mb-14">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">인기 게시물</h2>
          <div className="grid grid-cols-3 gap-3">
            {popularPosts.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="border rounded-lg p-3 hover:border-gray-400 transition"
              >
                <span className="text-xs text-gray-400">#{i + 1}</span>
                <p className="text-sm font-medium mt-1 line-clamp-2">{post.title}</p>
                <p className="text-xs text-gray-400 mt-2">조회 {post.viewCount}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
            <h2 className="text-xl font-semibold group-hover:underline">
              {post.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              <span>·</span>
              <span>조회 {post.viewCount}</span>
              <span>·</span>
              <span>좋아요 {post.likeCount}</span>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500">아직 글이 없습니다. 관리자 페이지에서 첫 글을 써보세요.</p>
        )}
      </div>
    </main>
  );
}
