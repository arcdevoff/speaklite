'use client';
import Link from 'next/link';
import '@/styles/notFound.scss';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="root">
      <Image src={'/images/not-found.svg'} width={500} height={500} alt="not found" />

      <h2>Страница не найдена</h2>

      <Link href="/">Домой</Link>
    </div>
  );
}
