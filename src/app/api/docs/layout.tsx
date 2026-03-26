import 'swagger-ui-react/swagger-ui.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swagger UI',
  description: 'Interactive Swagger UI for the Countries / States / Cities API.',
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
