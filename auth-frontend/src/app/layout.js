import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Auth System',
  description: 'Role-based authentication with CRUD',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}