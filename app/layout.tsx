import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 블로그',
  description: '나의 작품과 글을 담은 공간',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
