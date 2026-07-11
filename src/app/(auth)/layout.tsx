import Link from 'next/link';
import AuthTabs from '@/components/auth/AuthTabs';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-surface-container-low">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="text-2xl font-headline-md font-extrabold text-primary mb-8 text-center flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <span className="tracking-tighter">PAYIFY</span>
        </Link>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-surface py-8 px-4 sm:rounded-3xl sm:px-10 glass-card premium-shadow">
          <AuthTabs />
          {children}
        </div>
      </div>
    </div>
  );
}
