'use client';

import { useState, useRef } from 'react';

const WIDTH = 1080;
const MARGIN = 90;
const MAX_WIDTH = WIDTH - MARGIN * 2;
const BODY_FONT_SIZE = 46;
const BODY_LINE_HEIGHT = 66;
const FONT_FAMILY = "'Apple SD Gothic Neo', 'Malgun Gothic', -apple-system, sans-serif";

type Format = 'square' | 'portrait';

const HEIGHTS: Record<Format, number> = {
  square: 1080,
  portrait: 1350,
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  paragraphs.forEach((paragraph) => {
    if (paragraph.trim() === '') {
      lines.push('');
      return;
    }
    const words = paragraph.split(' ');
    let current = '';

    words.forEach((word) => {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
      while (ctx.measureText(current).width > maxWidth && current.length > 1) {
        let i = current.length - 1;
        while (i > 0 && ctx.measureText(current.slice(0, i)).width > maxWidth) i--;
        lines.push(current.slice(0, i));
        current = current.slice(i);
      }
    });
    lines.push(current);
  });

  return lines;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  height: number,
  title: string,
  category: string,
  dateLabel: string
) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WIDTH, height);

  ctx.fillStyle = '#9ca3af';
  ctx.font = `32px ${FONT_FAMILY}`;
  ctx.fillText(category, MARGIN, 220);

  ctx.fillStyle = '#111827';
  ctx.font = `bold 68px ${FONT_FAMILY}`;
  const titleLines = wrapText(ctx, title, MAX_WIDTH);
  let y = 320;
  titleLines.slice(0, 8).forEach((line) => {
    ctx.fillText(line, MARGIN, y);
    y += 84;
  });

  ctx.fillStyle = '#9ca3af';
  ctx.font = `30px ${FONT_FAMILY}`;
  ctx.fillText(dateLabel, MARGIN, height - 140);

  ctx.fillStyle = '#d1d5db';
  ctx.font = `28px ${FONT_FAMILY}`;
  ctx.fillText('이산의 블로그', MARGIN, height - 90);
}

function drawBodyPage(
  ctx: CanvasRenderingContext2D,
  height: number,
  title: string,
  lines: string[],
  pageNum: number,
  totalPages: number
) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WIDTH, height);

  ctx.fillStyle = '#9ca3af';
  ctx.font = `28px ${FONT_FAMILY}`;
  const shortTitle = title.length > 20 ? title.slice(0, 20) + '…' : title;
  ctx.fillText(shortTitle, MARGIN, 100);

  ctx.fillStyle = '#111827';
  ctx.font = `${BODY_FONT_SIZE}px ${FONT_FAMILY}`;
  let y = 220;
  lines.forEach((line) => {
    ctx.fillText(line, MARGIN, y);
    y += BODY_LINE_HEIGHT;
  });

  ctx.fillStyle = '#d1d5db';
  ctx.font = `28px ${FONT_FAMILY}`;
  ctx.fillText(`${pageNum} / ${totalPages}`, WIDTH - MARGIN - 90, height - 90);
}

export default function InstagramExport({
  title,
  category,
  createdAt,
  content,
}: {
  title: string;
  category: string;
  createdAt: string;
  content: string;
}) {
  const [format, setFormat] = useState<Format>('square');
  const [slides, setSlides] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function generate() {
    setGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const height = HEIGHTS[format];
    canvas.width = WIDTH;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dateLabel = new Date(createdAt).toLocaleDateString('ko-KR');
    const results: string[] = [];

    drawCover(ctx, height, title, category, dateLabel);
    results.push(canvas.toDataURL('image/png'));

    ctx.font = `${BODY_FONT_SIZE}px ${FONT_FAMILY}`;
    const allLines = wrapText(ctx, content, MAX_WIDTH);
    const availableHeight = height - 220 - 140;
    const linesPerPage = Math.max(1, Math.floor(availableHeight / BODY_LINE_HEIGHT));

    const pages: string[][] = [];
    for (let i = 0; i < allLines.length; i += linesPerPage) {
      pages.push(allLines.slice(i, i + linesPerPage));
    }

    pages.forEach((pageLines, i) => {
      drawBodyPage(ctx, height, title, pageLines, i + 1, pages.length);
      results.push(canvas.toDataURL('image/png'));
    });

    setSlides(results);
    setGenerating(false);
  }

  function downloadAll() {
    slides.forEach((dataUrl, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${title}-${i + 1}.png`;
        a.click();
      }, i * 300);
    });
  }

  return (
    <div className="border rounded-lg p-4">
      <canvas ref={canvasRef} className="hidden" />

      {slides.length === 0 ? (
        <div className="flex items-center gap-3">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="text-sm border rounded-full px-3 py-2 text-gray-600"
          >
            <option value="square">정사각형 (1080×1080)</option>
            <option value="portrait">세로형 (1080×1350)</option>
          </select>
          <button
            onClick={generate}
            disabled={generating}
            className="text-sm border rounded-full px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {generating ? '만드는 중...' : '📷 인스타용 이미지로 만들기'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">{slides.length}장의 이미지가 만들어졌어요</p>
            <button
              onClick={downloadAll}
              className="text-sm bg-black text-white rounded-full px-4 py-2"
            >
              전체 다운로드
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {slides.map((src, i) => (
              <a
                key={i}
                href={src}
                download={`${title}-${i + 1}.png`}
                className="flex-shrink-0"
              >
                <img
                  src={src}
                  alt={`slide-${i + 1}`}
                  className="w-28 h-28 object-cover border rounded"
                />
              </a>
            ))}
          </div>
          <button
            onClick={() => setSlides([])}
            className="text-xs text-gray-400 hover:text-gray-600 mt-3"
          >
            다시 만들기
          </button>
        </div>
      )}
    </div>
  );
}
