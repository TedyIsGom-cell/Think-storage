import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() || '';

  const posts = q
    ? await prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-700">
        ← 홈으로
      </Link>

      <form action="/search" className="mt-6 mb-8">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="글 검색하기..."
          className="w-full border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          autoFocus
        />
      </form>

      <h1 className="text-lg font-semibold mb-6">
        {q ? `"${q}" 검색 결과 (${posts.length})` : '검색어를 입력해주세요'}
      </h1>

      <div className="space-y-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
            <h2 className="text-xl font-semibold group-hover:underline">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {post.content}
            </p>
          </Link>
        ))}
        {q && posts.length === 0 && (
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>
    </main>
  );
}
