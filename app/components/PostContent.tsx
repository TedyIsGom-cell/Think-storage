import React from 'react';

// 글 내용을 한 줄씩 살펴보면서
// - ![](이미지주소) 형태의 줄은 사진으로
// - 유튜브 링크(youtube.com/watch?v=... 또는 youtu.be/...)만 있는 줄은 영상으로
// - 그 외에는 그냥 텍스트로 보여줍니다.

const IMAGE_LINE = /^!\[([^\]]*)\]\((\S+)\)$/;
const YOUTUBE_LINE = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})\S*$/;

export default function PostContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let textBuffer: string[] = [];

  function flushText() {
    if (textBuffer.length > 0) {
      const text = textBuffer.join('\n').replace(/\n+$/, '');
      if (text.trim()) {
        blocks.push(
          <p key={blocks.length} className="whitespace-pre-wrap leading-relaxed text-[17px] mb-4">
            {text}
          </p>
        );
      }
      textBuffer = [];
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim();
    const imgMatch = trimmed.match(IMAGE_LINE);
    const ytMatch = trimmed.match(YOUTUBE_LINE);

    if (imgMatch) {
      flushText();
      blocks.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={blocks.length}
          src={imgMatch[2]}
          alt={imgMatch[1]}
          className="w-full rounded-lg mb-6"
        />
      );
    } else if (ytMatch) {
      flushText();
      blocks.push(
        <div key={blocks.length} className="relative w-full mb-6" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allowFullScreen
            title="YouTube video"
          />
        </div>
      );
    } else {
      textBuffer.push(line);
    }
  });
  flushText();

  return <>{blocks}</>;
}
