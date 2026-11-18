import "./globals.css";

export const metadata = {
  title: "Maxsus taklif — ariza qoldiring",
  description: "Ma'lumotlaringizni qoldiring, mutaxassisimiz siz bilan bog'lanadi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
