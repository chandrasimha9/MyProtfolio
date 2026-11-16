import './globals.css';

export const metadata = {
  metadataBase: new URL('https://chandrasimha.dev'),
  title: 'CHANDRA SIMHA — Full-Stack Web Developer & AI Developer',
  description:
    'Personal portfolio of G Raja Chandra Simha Yadav. Computer Science and Engineering graduate specializing in Full-Stack Web Development, Python, FastAPI, React, MySQL, Automation, and Artificial Intelligence.',
  keywords: [
    'Chandra Simha',
    'G Raja Chandra Simha Yadav',
    'Full-Stack Developer',
    'AI Developer',
    'Python',
    'FastAPI',
    'React',
    'RAG',
    'Machine Learning',
    'Portfolio',
  ],
  authors: [{ name: 'G Raja Chandra Simha Yadav' }],
  openGraph: {
    title: 'CHANDRA SIMHA — Cinematic Developer Portfolio',
    description:
      'Full-Stack Web Developer & AI Developer transforming ideas into practical digital experiences.',
    type: 'website',
    images: ['/images/chandra-hero-poster.jpeg'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport = {
  themeColor: '#090A0F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased selection:bg-sky-500 selection:text-white min-h-screen relative overflow-x-hidden bg-[#07080b] text-slate-100 dark:bg-[#07080b] dark:text-slate-100 light:bg-[#f8fafc] light:text-slate-900">
        {/* Subtle cinematic film grain */}
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
