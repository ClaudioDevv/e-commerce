import Header from '@/app/ui/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header variant="main" />
      {children}
    </>
  );
}