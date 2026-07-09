import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            DiayFacture
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Gérez vos factures facilement
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
