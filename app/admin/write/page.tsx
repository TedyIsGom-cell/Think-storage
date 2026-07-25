'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function WritePost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category }),
    });

    setSaving(false);

    if (res.ok) {
      router.push('/');
    } else {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">새 글 쓰기</h1>
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
          placeholder="카테고리 (예: 에세이, 소설 / 비워두면 '일반')"
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="w-full border rounded px-3 py-2 h-96"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white rounded px-6 py-2 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '발행하기'}
        </button>
      </form>
    </main>
  );
}
