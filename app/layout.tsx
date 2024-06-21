import { Lato } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import DemoModal from './components/modals/DemoModal';
import ImageModal from './components/modals/ImageModal';
import ToasterProvider from './providers/ToasterProvider';
import { GoogleTagManager } from '@next/third-parties/google';
import PlaygroundFeedbackModal from './components/modals/PlaygroundFeedbackModal';
import InfoModal from './components/modals/InfoModal';
import PricingContactModal from './components/modals/PricingContactModal';
import ResultZoomModal from './components/modals/ResultZoomModal';

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
        {/* <UploadModal /> */}
        <PricingContactModal />
        <PlaygroundFeedbackModal />
        <InfoModal />
        <ResultZoomModal />
        <div className="pb-500 min-h-screen min-w-[650px]">{children}</div>
        <Footer />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
    </html>
  );
}
