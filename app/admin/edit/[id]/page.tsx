'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPost({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((cats) => setCategoryOptions(cats.map((c: { name: string }) => c.name)));
  }, []);

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then((res) => res.json())
      .then((post) => {
        setTitle(post.title || '');
        setCategory(post.category || '');
        setContent(post.content || '');
        setSlug(post.slug || '');
        setLoading(false);
      });
  }, [params.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const res = await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category }),
    });

    setSaving(false);

    if (res.ok) {
      router.push(`/posts/${slug}`);
    } else {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    }
  }

  async function handleDelete() {
    if (!confirm('이 글을 삭제할까요? 되돌릴 수 없습니다.')) return;
    const res = await fetch(`/api/posts/${params.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/');
    }
  }

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full border rounded px-3 py-2 text-lg"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="카테고리"
          className="w-full border rounded px-3 py-2 text-sm"
          list="category-options"
        />
        <datalist id="category-options">
          {categoryOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="w-full border rounded px-3 py-2 h-96"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white rounded px-6 py-2 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '수정 완료'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700"
          >
            이 글 삭제하기
          </button>
        </div>
      </form>
    </main>
  );
}
