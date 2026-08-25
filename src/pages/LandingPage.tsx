import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FormFeedback } from '../components/FormFeedback';
import { FormContact } from '../components/FormContact';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { TypographyAccent } from '../components/TypographyAccent';
import { useAuth } from '../utils/AuthProvider';
import { useBankingAuth } from '../hooks/useBankingAuth';

const LandingPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { initiateLogin } = useBankingAuth();

  useEffect(() => {
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);

  const onPatientLoginClick = () => {
    initiateLogin();
  }

  if (isLoggedIn) {
    return null; 
  }

  return (
    <div className="font-sans text-primary-deep-blue leading-[1.6] bg-primary-white">
      <img
        src="../assets/landing-banner.jpg"
        alt="Healthcare banner"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.72] saturate-[1.1]"
      />
      <Header />
      <main className="mt-14">
        <section className="relative min-h-[92vh] overflow-hidden text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-gradient-dark-start to-gradient-dark-end overflow-hidden min-h-[92vh]" />

          <div className="relative z-[1] max-w-[1200px] mx-auto px-5 pt-40 pb-25 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <TypographyAccent className="tracking-[0.24em]">Trusted local care</TypographyAccent>
              <h1 className="text-[48px] my-5 leading-[1.05] max-w-[560px]">Complete care for your family and community.</h1>
              <p className="text-[18px] mb-8 max-w-[540px] text-primary-light-gray">
                Modern facilities, experienced staff, and thoughtful treatment plans all inspired by the warm and calming tones of our community.
              </p>
              <div className="flex gap-4 flex-wrap">
                <a href="#contact">
                  <ButtonPrimary className="hover:text-white">Book an appointment</ButtonPrimary>
                </a>
                <a href="#services">
                  <ButtonPrimary 
                    className="border border-accent-purple-border text-primary-white bg-transparent hover:bg-accent-purple">
                      View services
                  </ButtonPrimary>
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-[540px] overflow-hidden shadow-[0_30px_60px_shadow-dark]">
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="my-16 py-[60px] px-5 bg-primary-white">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-10">
              <TypographyAccent className="text-primary-deep-blue">Our services</TypographyAccent>
              <h2 className="text-[36px] mt-4 mb-0 text-accent-purple">Health care designed around you</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Primary care', description: 'Routine exams, preventive care, and chronic condition management for all ages.' },
                { title: 'Wellness programs', description: 'Nutrition guidance, mental health support, and lifestyle coaching.' },
                { title: 'Laboratory services', description: 'On-site testing and rapid diagnostics for faster results and treatment.' },
              ].map((card) => (
                <div key={card.title} className="p-7 rounded-[20px] bg-bg-white shadow-[0_10px_24px_shadow-light] border-t-4 border-accent-purple">
                  <h3 className="mb-4 text-[22px] text-primary-deep-blue">{card.title}</h3>
                  <p className="m-0 text-primary-dark-gray">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-[60px] px-5">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <TypographyAccent>About us</TypographyAccent>
              <h2 className="text-[36px] mt-4 mb-4 text-accent-purple">Caring for our community with trusted medical expertise.</h2>
              <p className="text-primary-dark-gray text-[18px] mb-5">
                Our clinic combines modern technology with compassionate care to deliver a seamless health experience. We focus on prevention, early diagnosis, and patient-centered service.
              </p>
              <ul className="list-none p-0 m-0 text-primary-dark-gray">
                <li className="mb-3">• Board-certified physicians and specialists</li>
                <li className="mb-3">• Same-day appointments and virtual visits</li>
                <li>• Family-focused care plans and health education</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[20px] overflow-hidden shadow-[0_20px_40px_shadow-medium]">
                <img src="../assets/hc-img-1.jpg" alt="Doctor consult" className="w-full block" />
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-[0_20px_40px_shadow-medium]">
                <img src="../assets/hc-img.jpg" alt="Patient care" className="w-full block" />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-primary-deep-blue text-white py-[60px] px-5 my-16">
          <div className="max-w-[1200px] mx-auto text-center">
            <TypographyAccent className="text-primary-slate-gray">Testimonials</TypographyAccent>
            <h2 className="text-[36px] mt-4 mb-10">Patients trust us for care that feels personal.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Mia R.', quote: 'The staff was welcoming and thorough. I felt supported every step of the way.' },
                { name: 'Noah L.', quote: 'Fast appointment scheduling and excellent follow-up care made a huge difference.' },
                { name: 'Sofia K.', quote: 'Great experience for my children. The doctors explained everything in a calm, reassuring way.' },
              ].map((item) => (
                <div key={item.name} className="p-7 rounded-[20px] bg-bg-dark-blue shadow-[0_10px_24px_shadow-strong] border-t-4 border-[rgba(198,205,222,0.47)]">
                  <p className="mb-6 text-primary-medium-gray">&ldquo;{item.quote}&rdquo;</p>
                  <p className="m-0 font-bold">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-[60px] px-5">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <TypographyAccent className="text-status-blue">Get in touch</TypographyAccent>
              <h2 className="text-[36px] mt-4 mb-6 text-accent-purple">Book your appointment today.</h2>
              <p className="text-primary-dark-gray text-[18px] m-0">Call us, send a message, or login to book an appointment for quick, compassionate support.</p>
              <div className="mt-8 grid gap-4">
                <div className="bg-bg-light-blue rounded-[16px] p-5">
                  <strong>Phone</strong>
                  <p className="m-1">(555) 123-4567</p>
                </div>
                <div className="bg-bg-light-blue rounded-[16px] p-5 flex justify-between items-center">
                  <div>
                    <strong>Online</strong>
                    <p className="m-1">Log in with your bank credentials</p>

                  </div>
                  <ButtonPrimary
                    type="button"
                    onClick={() => onPatientLoginClick()}
                    className="
                      border border-accent-purple-border 
                      text-accent-purple-border 
                      bg-transparent px-[18px] py-[5px] rounded-[4px] 
                      hover:bg-accent-purple hover:text-white"
                  >
                    Log in
                  </ButtonPrimary>
                </div>
              </div>
            </div>
            <div className="bg-bg-white rounded-[24px] p-8 shadow-[0_25px_50px_shadow-light]">
              <FormContact />
            </div>
          </div>
        </section>

        <section id="feedback" className="bg-primary-deep-blue text-white py-[60px] px-5">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="bg-bg-dark-blue rounded-[24px] p-8 shadow-[0_25px_50px_shadow-light]">
              <FormFeedback />
            </div>
            <div>
              <TypographyAccent className="text-primary-slate-gray">Feedback</TypographyAccent>
              <h2 className="text-[36px] mt-4 mb-6 text-primary-white">Share your experience with our care team.</h2>
              <p className="text-primary-medium-gray text-[18px] m-0">We value your feedback to improve our services and ensure every visit is exceptional.</p>
            </div>
          </div>
        </section>

        <section id="locations" className="my-16 py-[60px] px-5 bg-primary-white">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-10">
              <TypographyAccent className="text-status-blue">Locations</TypographyAccent>
              <h2 className="text-[36px] mt-4 mb-0 text-accent-purple">Find us across Brussels</h2>
              <p className="max-w-[640px] mt-4 mx-auto text-primary-dark-gray text-[18px]">Visit any of our three convenient Brussels clinics with easy access and friendly support.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'City Center Clinic', address: 'Rue de la Loi 10, 1000 Brussels', neighborhood: 'Central Brussels' },
                { title: 'Ixelles Family Care', address: 'Avenue Louise 45, 1050 Brussels', neighborhood: 'Ixelles' },
                { title: 'Etterbeek Health Hub', address: 'Chaussée de Wavre 212, 1040 Brussels', neighborhood: 'Etterbeek' },
              ].map((location) => (
                <div key={location.title} className="rounded-[20px] bg-bg-white shadow-[0_10px_24px_shadow-light] overflow-hidden">
                  <div className="relative h-[180px] bg-status-blue-light overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gradient-blue-1 to-gradient-blue-2" />
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, gradient-white, transparent 20%), radial-gradient(circle at 70% 60%, gradient-gray, transparent 18%)' }} />
                    <div className="absolute left-5 bottom-5 text-primary-deep-blue font-bold flex items-center gap-2.5">
                      <span className="w-10 h-10 grid place-items-center rounded-full bg-[rgba(15,23,42,0.8)] text-white">🗺️</span>
                      <div>
                        <p className="m-0 text-sm uppercase tracking-[0.12em]">Brussels</p>
                        <p className="mt-1.5 mb-0 text-base">{location.neighborhood}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2.5 text-[22px] text-primary-deep-blue">{location.title}</h3>
                    <p className="mb-2 text-primary-dark-gray">{location.address}</p>
                    <p className="m-0 text-primary-slate-gray text-sm">Open weekdays with evening hours available.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />       
    </div>
  );
};

export default LandingPage;
