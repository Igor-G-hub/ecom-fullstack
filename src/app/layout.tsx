import type { Metadata } from 'next';
import './globals.scss';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { ReduxProvider } from '@/components/ReduxProvider';

export const metadata: Metadata = {
  title: 'Product Catalog',
  description: 'Product Catalog Application'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ReduxProvider>
            <AuthGuard>{children}</AuthGuard>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


