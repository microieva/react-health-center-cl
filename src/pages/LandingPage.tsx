import React, { useEffect, useState } from 'react';

const LandingPage: React.FC = () => {
  const [contactMe, setContactMe] = useState(true);
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937', lineHeight: 1.6, backgroundColor: '#f8fafc' }}>
      <img
        src="../assets/landing-banner.jpg"
        alt="Healthcare banner"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) saturate(1.1)' }}
      />
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
        <div
          style={{
            backdropFilter: 'blur(18px)',
            backgroundColor: 'rgba(15, 23, 42, 0.22)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 20px',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 24, color: '#f8fafc' }}>Health Center</div>
            <nav style={{ display: 'flex', gap: 24, fontSize: 14, alignItems: 'center' }}>

              <a href="#services" style={{ color: '#f8fafc', textDecoration: 'none' }}>Services</a>
              <a href="#about" style={{ color: '#f8fafc', textDecoration: 'none' }}>About</a>
              <a href="#testimonials" style={{ color: '#f8fafc', textDecoration: 'none' }}>Testimonials</a>              
              <a href="#locations" style={{ color: '#f8fafc', textDecoration: 'none' }}>Locations</a>
              <a href="#feedback" style={{ color: '#f8fafc', textDecoration: 'none' }}>Send feedback</a>              
              <a href="#contact" style={{ color: '#f8fafc', textDecoration: 'none' }}>Contact</a>
              <button
                type="button"
                
                style={{
                  border: '1px solid rgba(175, 111, 174, 0.65)',
                  color: '#f8fafc',
                  backgroundColor: 'transparent',
                  padding: '5px 18px',
                  borderRadius: 5,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Log in
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main style={{marginTop: '4rem'}}>
        <section style={{ position: 'relative', minHeight: '92vh', overflow: 'hidden', color: '#fff' }}>
          
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.82))', overflow: 'hidden', minHeight:'92vh'}} />
         

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '160px 20px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.24em', fontSize: 12, margin: 0, color: '#af6faee6' }}>Trusted local care</p>
              <h1 style={{ fontSize: 48, margin: '20px 0 20px', lineHeight: 1.05, maxWidth: 560 }}>Complete care for your family and community.</h1>
              <p style={{ fontSize: 18, margin: '0 0 32px', maxWidth: 540, color: '#e2e8f0' }}>
                Modern facilities, experienced staff, and thoughtful treatment plans all inspired by the warm and calming tones of our community.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a
                  href="#contact"
                  style={{
                    backgroundColor: '#af6faee6',
                    color: '#0f172a',
                    padding: '14px 24px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Book an appointment
                </a>
                <a
                  href="#services"
                  style={{
                    border: '1px solid rgba(175, 111, 174, 0.65)',
                    color: '#f8fafc',
                    padding: '14px 24px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  View services
                </a>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 540, overflow: 'hidden', boxShadow: '0 30px 60px rgba(15, 23, 42, 0.24)' }}>
              </div>
            </div>
            
          </div>
        </section>

        <section id="services" style={{ marginBlock: '4rem', padding: '60px 20px', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.2em', fontSize: 12, margin: 0 }}>Our services</p>
              <h2 style={{ fontSize: 36, margin: '16px 0 0', color: '#af6faee6' }}>Health care designed around you</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
              {[
                { title: 'Primary care', description: 'Routine exams, preventive care, and chronic condition management for all ages.' },
                { title: 'Wellness programs', description: 'Nutrition guidance, mental health support, and lifestyle coaching.' },
                { title: 'Laboratory services', description: 'On-site testing and rapid diagnostics for faster results and treatment.' },
              ].map((card) => (
                <div key={card.title} style={{ padding: 28, borderRadius: 20, backgroundColor: '#fff', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)', borderTop: '4px solid #af6faee6' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 22, color: '#0f172a' }}>{card.title}</h3>
                  <p style={{ margin: 0, color: '#475569' }}>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ textTransform: 'uppercase', color: '#af6faee6', letterSpacing: '0.2em', fontSize: 12, margin: 0 }}>About us</p>
              <h2 style={{ fontSize: 36, margin: '16px 0 16px', color: '#af6faee6' }}>Caring for our community with trusted medical expertise.</h2>
              <p style={{ color: '#475569', fontSize: 18, margin: '0 0 20px' }}>
                Our clinic combines modern technology with compassionate care to deliver a seamless health experience. We focus on prevention, early diagnosis, and patient-centered service.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569' }}>
                <li style={{ marginBottom: 12 }}>• Board-certified physicians and specialists</li>
                <li style={{ marginBottom: 12 }}>• Same-day appointments and virtual visits</li>
                <li>• Family-focused care plans and health education</li>
              </ul>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)' }}>
                <img src="../assets/hc-img-1.jpg" alt="Doctor consult" style={{ width: '100%', display: 'block' }} />
              </div>
              <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)' }}>
                
                <img src="../assets/hc-img.jpg" alt="Patient care" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          </div>
        </section>

       

        <section id="testimonials" style={{ backgroundColor: '#0f172a', color: '#fff', padding: '60px 20px', marginBlock: '4rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 12, margin: 0, color: '#94a3b8' }}>Testimonials</p>
            <h2 style={{ fontSize: 36, margin: '16px 0 40px' }}>Patients trust us for care that feels personal.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {[
                { name: 'Mia R.', quote: 'The staff was welcoming and thorough. I felt supported every step of the way.' },
                { name: 'Noah L.', quote: 'Fast appointment scheduling and excellent follow-up care made a huge difference.' },
                { name: 'Sofia K.', quote: 'Great experience for my children. The doctors explained everything in a calm, reassuring way.' },
              ].map((item) => (
                <div key={item.name} style={{ padding: 28, borderRadius: 20, backgroundColor: '#1e293b', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.22)', borderTop: '4px solid rgba(198, 205, 222, 0.47)' }}>
                  <p style={{ margin: '0 0 24px', color: '#cbd5e1' }}>&ldquo;{item.quote}&rdquo;</p>
                  <p style={{ margin: 0, fontWeight: 700 }}>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
            <div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 12, margin: 0, color: '#0284c7' }}>Get in touch</p>
              <h2 style={{ fontSize: 36, margin: '16px 0 24px', color: '#af6faee6' }}>Book your appointment today.</h2>
              <p style={{ color: '#475569', fontSize: 18, margin: 0 }}>Call us, send a message, or visit our clinic for quick, compassionate support.</p>
              <div style={{ marginTop: 32, display: 'grid', gap: 16 }}>
                <div style={{ backgroundColor: '#f1f5f9', borderRadius: 16, padding: 20 }}>
                  <strong>Phone</strong>
                  <p style={{ margin: 4 }}>(555) 123-4567</p>
                </div>
                <div style={{ backgroundColor: '#f1f5f9', borderRadius: 16, padding: 20 }}>
                  <strong>Location</strong>
                  <p style={{ margin: 4 }}>123 Wellness Avenue, Suite 100</p>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 25px 50px rgba(15, 23, 42, 0.08)' }}>
              <form style={{ display: 'grid', gap: 16 }}>
                <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#334155' }}>
                  Name
                  <input type="text" placeholder="Your name" style={{ borderRadius: 12, border: '1px solid #cbd5e1', padding: '12px 14px', width: '100%' }} />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#334155' }}>
                  Email
                  <input type="email" placeholder="you@example.com" style={{ borderRadius: 12, border: '1px solid #cbd5e1', padding: '12px 14px', width: '100%' }} />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#334155' }}>
                  Message
                  <textarea placeholder="How can we help?" rows={5} style={{ borderRadius: 12, border: '1px solid #cbd5e1', padding: '12px 14px', width: '100%' }} />
                </label>
                <button type="submit" style={{ backgroundColor: '#af6faee6', color: '#fff', border: 'none', padding: '14px 20px', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}>Send message</button>
              </form>
            </div>
          </div>
        </section>
        <section id="feedback" style={{ backgroundColor: '#0f172a', color: '#fff', padding: '60px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
            
            <div style={{ backgroundColor: '#1e293b', borderRadius: 24, padding: 32, boxShadow: '0 25px 50px rgba(15, 23, 42, 0.08)' }}>
              
              <form style={{ display: 'grid', gap: 16 }}>
                <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#cbd5e1' }}>
                  Feedback
                  <textarea placeholder="How was your experience?" rows={5} style={{ borderRadius: 12, border: '1px solid #334155', padding: '12px 14px', width: '100%', backgroundColor: '#0f172a', color: '#fff' }} />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#cbd5e1' }}>
                      <input
                        type="checkbox"
                        checked={contactMe}
                        onChange={(event) => setContactMe(event.target.checked)}
                        style={{ accentColor: '#af6faee6' }}
                      />
                      Contact me
                    </label>
                      <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#cbd5e1' }}>
                        Email
                      <input type="email" placeholder="you@example.com" style={{ visibility: contactMe ? 'visible' : 'hidden', borderRadius: 12, border: '1px solid #334155', padding: '12px 14px', width: '100%', backgroundColor: '#0f172a', color: '#fff' }} />
                      </label>
                  </div>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#cbd5e1' }}>
                      <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={(event) => setAnonymous(event.target.checked)}
                        style={{ accentColor: '#af6faee6' }}
                      />
                      Anonymous
                    </label>
                      <label style={{ display: 'grid', gap: 8, fontSize: 14, color: '#cbd5e1' }}>
                        Name
   
                        <input type="text" placeholder="Your name" style={{ visibility: anonymous ? 'hidden' : 'visible', borderRadius: 12, border: '1px solid #334155', padding: '12px 14px', width: '100%', backgroundColor: '#0f172a', color: '#fff' }} />
                      </label>
                  </div>

                </div>
                <button type="submit" style={{ backgroundColor: '#af6faee6', color: '#0f172a', border: 'none', padding: '14px 20px', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}>Send feedback</button>
              </form>
            </div>
            <div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 12, margin: 0, color: '#94a3b8' }}>Feedback</p>
              <h2 style={{ fontSize: 36, margin: '16px 0 24px', color: '#f8fafc' }}>Share your experience with our care team.</h2>
              <p style={{ color: '#cbd5e1', fontSize: 18, margin: 0 }}>We value your feedback to improve our services and ensure every visit is exceptional.</p>
            </div>
          </div>
        </section>
         <section id="locations" style={{ marginBlock: '4rem', padding: '60px 20px', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.2em', fontSize: 12, margin: 0 }}>Locations</p>
              <h2 style={{ fontSize: 36, margin: '16px 0 0', color: '#af6faee6' }}>Find us across Brussels</h2>
              <p style={{ maxWidth: 640, margin: '16px auto 0', color: '#475569', fontSize: 18 }}>Visit any of our three convenient Brussels clinics with easy access and friendly support.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {[
                { title: 'City Center Clinic', address: 'Rue de la Loi 10, 1000 Brussels', neighborhood: 'Central Brussels' },
                { title: 'Ixelles Family Care', address: 'Avenue Louise 45, 1050 Brussels', neighborhood: 'Ixelles' },
                { title: 'Etterbeek Health Hub', address: 'Chaussée de Wavre 212, 1040 Brussels', neighborhood: 'Etterbeek' },
              ].map((location) => (
                <div key={location.title} style={{ borderRadius: 20, backgroundColor: '#fff', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: 180, backgroundColor: '#dbeafe', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(14,165,233,0.14))' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 20%), radial-gradient(circle at 70% 60%, rgba(148,163,184,0.28), transparent 18%)' }} />
                    <div style={{ position: 'absolute', left: 20, bottom: 20, color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: '50%', backgroundColor: 'rgba(15,23,42,0.8)', color: '#fff' }}>🗺️</span>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Brussels</p>
                        <p style={{ margin: '6px 0 0', fontSize: 16 }}>{location.neighborhood}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 style={{ margin: '0 0 10px', fontSize: 22, color: '#0f172a' }}>{location.title}</h3>
                    <p style={{ margin: '0 0 8px', color: '#475569' }}>{location.address}</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Open weekdays with evening hours available.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ backdropFilter: 'blur(18px)',
            backgroundColor: 'rgba(15, 23, 42, 0.22)', color: 'white', padding: '24px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ margin: 0 }}>© 2026 Health Center. All rights reserved.</p>
          <p style={{ margin: 0 }}>Trusted health services for your family.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
