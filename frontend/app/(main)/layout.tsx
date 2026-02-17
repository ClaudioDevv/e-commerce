import Header from '../ui/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header variant="main" />
      {children}
    </>
  );
}