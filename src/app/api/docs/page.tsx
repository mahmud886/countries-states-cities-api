'use client';

import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(async () => (await import('swagger-ui-react')).default as any, { ssr: false }) as any;

export default function ApiDocsPage() {
  return (
    <main className='min-h-screen bg-white'>
      <SwaggerUI url='/api/openapi' />
    </main>
  );
}
