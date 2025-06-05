export default function TitleBar({
  title,
  children
}: Readonly<{
  title: string;
  children?: React.ReactNode;
}>) {
  return (
    <div className="sticky top-0 bg-sidebar text-sidebar-foreground">
      <div className="w-full flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
      <div className="w-full h-6 rounded-tl-full bg-background"></div>
    </div>
  );
}
