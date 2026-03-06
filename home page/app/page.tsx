import TopHeader from '@/components/common/top-header';
import Header from '@/components/common/header';
import HeroAnimated from '@/components/common/hero-animated';
import About from '@/components/home/about';
import Services from '@/components/home/services';
import Process from '@/components/home/process';
import PortfolioEnhanced from '@/components/home/portfolio-enhanced';
import Testimonials from '@/components/home/testimonials';
import GlobalPresenceRedesigned from '@/components/home/global-presence-redesigned';
import GeomapNetwork from '@/components/home/geomap-network';
import CounterTiles from '@/components/home/counter-tiles';
import ContactSection from '@/components/home/contact-section';
import Footer from '@/components/common/footer';
import CTASection from '@/components/common/quick-actions';
import ServicePartners from '@/components/common/service-partners';

export default function Home() {
  return (
    <main>
      <TopHeader />
      <Header />
      <HeroAnimated />
      <About />
      <Services />
      <GlobalPresenceRedesigned />
      <CTASection />
      <Process />
      <PortfolioEnhanced />
      <div className="px-8 md:px-15 text-center">
        <div
          className="relative rounded-3xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Italy-img.jpg)",
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-black/80"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center w-full  gap-4 h-full p-6">
            <h2 className="text-4xl text-white">Why choose us: We are the gateway to a successful and seamless exhibit</h2>
            <p className="text-white/80">
              We have years of experience in exhibition stand designing and building, which is one of the major reasons why we are one of the most favourite exhibitions stand builders in Europe for the exhibitors. With our experience in the exhibition industry, we have built a number of exhibitions stands that not just pull the crowd to the displays for the bands but also generate sales leads, and help them in boosting their brand presence on the crowded display ground. This has helped us in earning a strong reputation as the best place for the exhibition stands that are of high-quality, tailor-made and help brands to stand out in the sea of exhibitors. Being a popular exhibition stand contractor in Europe, we ensure that every stand we create is unique, creative, customised, embodies excellence, and craftsmanship that tells your brand story and conveys the desired brand message to your target audience.
            </p>
          </div>
        </div>
      </div>
      <Testimonials />
      <GeomapNetwork />
      <ServicePartners />
      <ContactSection />
      <Footer />
    </main>
  );
}
