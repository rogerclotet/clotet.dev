import Header from "../_components/header";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="container mx-auto px-2 lg:px-4 xl:px-8 mb-6 pt-32">
        {children}
      </div>
    </>
  );
}
