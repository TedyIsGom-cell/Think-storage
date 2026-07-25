'use client';

import { useState, useEffect, FormEvent } from 'react';
import { formatDateTime } from '@/lib/format';

type Comment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function CommentSection({
  postId,
  isAdmin,
}: {
  postId: number;
  isAdmin: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  async function loadComments() {
    const res = await fetch(`/api/posts/${postId}/comments`);
    if (res.ok) {
      setComments(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!author.trim() || !password.trim() || !content.trim()) {
      setError('이름, 비밀번호, 내용을 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, password, content }),
    });
    setSubmitting(false);

    if (res.ok) {
      setAuthor('');
      setPassword('');
      setContent('');
      loadComments();
    } else {
      setError('댓글 작성에 실패했습니다.');
    }
  }

  async function handleDelete(commentId: number) {
    if (!confirm('이 댓글을 삭제할까요?')) return;
    const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

  function startEdit(comment: Comment) {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }

  async function submitEdit(commentId: number) {
    if (!editContent.trim()) return;
    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });
    if (res.ok) {
      setEditingId(null);
      loadComments();
    }
  }

  return (
    <section className="mt-16">
      <h2 className="text-lg font-semibold mb-4">
        댓글 {comments.length > 0 ? `(${comments.length})` : ''}
      </h2>

      <div className="space-y-4 mb-8">
        {loading && <p className="text-sm text-gray-400">불러오는 중...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-gray-400">아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{comment.author}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {formatDateTime(comment.createdAt)}
                </span>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => startEdit(comment)}
                      className="text-xs text-gray-400 hover:text-gray-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>

            {editingId === comment.id ? (
              <div className="mt-2 space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm h-20"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => submitEdit(comment.id)}
                    className="text-xs bg-black text-white rounded px-3 py-1"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs text-gray-400"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 bg-gray-50 rounded-lg p-4">
        <div className="flex gap-2">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름"
            className="w-1/2 border rounded px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-1/2 border rounded px-3 py-2 text-sm"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 남겨보세요"
          className="w-full border rounded px-3 py-2 text-sm h-20"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
        >
          {submitting ? '등록 중...' : '댓글 등록'}
        </button>
      </form>
    </section>
  );
}
