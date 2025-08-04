import Navigation from '../Navigation';
import Hero from '../Hero';
import About from '../About';
import Skills from '../Skills';
import Portfolio from '../Portfolio';
import Tools from '../Tools';
import Certificates from '../Certificates';
import Testimonials from '../Testimonials';
import Contact from '../Contact';
import NetworkStatusIndicator from '../NetworkStatusIndicator';
import { Toaster } from 'sonner';

interface MainLayoutProps {
  showAllProjects: boolean;
  onShowAllProjectsChange: (show: boolean) => void;
  onShowCertificatesOnly: (show: boolean) => void;
  onShowTestimonialsOnly: (show: boolean) => void;
}

const MainLayout = ({ 
  showAllProjects, 
  onShowAllProjectsChange, 
  onShowCertificatesOnly, 
  onShowTestimonialsOnly 
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <NetworkStatusIndicator />
      {!showAllProjects && <Navigation />}
      <div className={!showAllProjects ? "pt-16" : ""}>
        {!showAllProjects && (
          <section id="hero">
            <Hero />
          </section>
        )}
        {!showAllProjects && (
          <section id="about">
            <About />
          </section>
        )}
        {!showAllProjects && (
          <section id="skills">
            <Skills />
          </section>
        )}
        <section id="portfolio">
          <Portfolio onShowAllProjectsChange={onShowAllProjectsChange} />
        </section>
        {!showAllProjects && (
          <section id="tools">
            <Tools />
          </section>
        )}
        {!showAllProjects && (
          <section id="certificates">
            <Certificates onShowCertificatesOnly={onShowCertificatesOnly} />
          </section>
        )}
        {!showAllProjects && (
          <section id="testimonials">
            <Testimonials onShowTestimonialsOnly={onShowTestimonialsOnly} />
          </section>
        )}
        {!showAllProjects && (
          <section id="contact">
            <Contact />
          </section>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;