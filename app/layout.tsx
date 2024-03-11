import { Lato } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import DemoModal from './components/modals/DemoModal';
import ImageModal from './components/modals/ImageModal';
import ToasterProvider from './providers/ToasterProvider';
import { GoogleTagManager } from '@next/third-parties/google';
import UploadModal from './components/modals/UploadModal';
import PlaygroundFeedbackModal from './components/modals/PlaygroundFeedbackModal';

export const metadata = {
  title: 'cambioml',
  description: 'Build faster with CambioML',
};

const font = Lato({
  weight: ['400', '700'],
  style: 'normal',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <Navbar />
        <DemoModal />
        <ImageModal />
        <UploadModal />
        <PlaygroundFeedbackModal />
        <div className="pb-500 min-h-screen min-w-[650px]">
          {children}
          <Footer />
        </div>
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
    </html>
  );
}
