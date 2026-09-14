import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Services from '@/components/landing/Services';
import Capacity from '@/components/landing/Capacity';
import Gallery from '@/components/landing/Gallery';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services onViewProjects={(category) => setServiceFilter(category)} />
        <Capacity />
        <Gallery
          externalFilter={serviceFilter}
          onFilterConsumed={() => setServiceFilter(null)}
        />
      </main>
      <Footer />
    </div>
  );
}
