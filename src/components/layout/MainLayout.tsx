interface MainLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export default function MainLayout({ sidebar, content }: MainLayoutProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">{sidebar}</div>
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">{content}</div>
      </div>
    </main>
  );
}
