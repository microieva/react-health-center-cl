import React, { useEffect } from 'react';

const LandingPage: React.FC = () => {
  useEffect(() => {
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937', lineHeight: 1.6 }}>
      <header style={{ backgroundColor: '#0f172a', color: '#fff', padding: '24px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 24 }}>Health Center</div>
          <nav style={{ display: 'flex', gap: 24, fontSize: 14 }}>
            <a href="#services" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Services</a>
            <a href="#about" style={{ color: '#e2e8f0', textDecoration: 'none' }}>About</a>
            <a href="#testimonials" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Testimonials</a>
            <a href="#contact" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section style={{ backgroundColor: '#0f172a', color: '#fff', padding: '80px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 48, margin: '0 0 20px', lineHeight: 1.05 }}>Complete care for your family and community.</h1>
              <p style={{ fontSize: 18, margin: '0 0 32px', maxWidth: 540, color: '#cbd5e1' }}>
                Trusted local health services with modern facilities, experienced staff, and personalized treatment plans to keep you and your loved ones healthy.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#contact" style={{ backgroundColor: '#38bdf8', color: '#0f172a', padding: '14px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Book an appointment</a>
                <a href="#services" style={{ border: '1px solid #94a3b8', color: '#e2e8f0', padding: '14px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>View services</a>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 520, borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)' }}>
                <img src="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=900&q=80" alt="Healthcare team" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          </div>
        </section>

        <section id="services" style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.2em', fontSize: 12, margin: 0 }}>Our services</p>
              <h2 style={{ fontSize: 36, margin: '16px 0 0' }}>Health care designed around you</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
              {[
                { title: 'Primary care', description: 'Routine exams, preventive care, and chronic condition management for all ages.' },
                { title: 'Wellness programs', description: 'Nutrition guidance, mental health support, and lifestyle coaching.' },
                { title: 'Laboratory services', description: 'On-site testing and rapid diagnostics for faster results and treatment.' },
              ].map((card) => (
                <div key={card.title} style={{ padding: 28, borderRadius: 20, backgroundColor: '#fff', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 22 }}>{card.title}</h3>
                  <p style={{ margin: 0, color: '#475569' }}>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.2em', fontSize: 12, margin: 0 }}>About us</p>
              <h2 style={{ fontSize: 36, margin: '16px 0 16px' }}>Caring for our community with trusted medical expertise.</h2>
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
                <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80" alt="Doctor consult" style={{ width: '100%', display: 'block' }} />
              </div>
              <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)' }}>
                <img src="https://images.unsplash.com/photo-1580281657521-6dd9f43b88bc?auto=format&fit=crop&w=800&q=80" alt="Patient care" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" style={{ backgroundColor: '#0f172a', color: '#fff', padding: '60px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 12, margin: 0, color: '#94a3b8' }}>Testimonials</p>
            <h2 style={{ fontSize: 36, margin: '16px 0 40px' }}>Patients trust us for care that feels personal.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {[
                { name: 'Mia R.', quote: 'The staff was welcoming and thorough. I felt supported every step of the way.' },
                { name: 'Noah L.', quote: 'Fast appointment scheduling and excellent follow-up care made a huge difference.' },
                { name: 'Sofia K.', quote: 'Great experience for my children. The doctors explained everything in a calm, reassuring way.' },
              ].map((item) => (
                <div key={item.name} style={{ backgroundColor: '#1e293b', padding: 28, borderRadius: 20, minHeight: 180 }}>
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
              <h2 style={{ fontSize: 36, margin: '16px 0 24px' }}>Book your appointment today.</h2>
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
                <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '14px 20px', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}>Send message</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: '#020617', color: '#94a3b8', padding: '24px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ margin: 0 }}>© 2026 Health Center. All rights reserved.</p>
          <p style={{ margin: 0 }}>Trusted health services for your family.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
