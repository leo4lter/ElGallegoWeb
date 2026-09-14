import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import WorkAreas from '@/components/landing/WorkAreas';
import Services from '@/components/landing/Services';
import Capacity from '@/components/landing/Capacity';
import Gallery from '@/components/landing/Gallery';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <WorkAreas />
        <Services />
        <Capacity />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
