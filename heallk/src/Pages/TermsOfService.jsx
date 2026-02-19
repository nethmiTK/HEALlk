import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '80px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #166534, #15803d)',
          borderRadius: '16px',
          padding: '48px 40px',
          marginBottom: '40px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 12px' }}>Terms of Service</h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.85, margin: 0 }}>Last updated: February 2025</p>
        </div>

        {/* Content Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px 40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          lineHeight: '1.8',
          color: '#374151'
        }}>
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Acceptance of Terms</h2>
            <p>By accessing or using HELA LANKA's platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Use of the Platform</h2>
            <p>HELA LANKA provides a platform to connect patients with verified Ayurvedic healthcare professionals. You agree to:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>Provide accurate and truthful information during registration and use</li>
              <li style={{ marginBottom: '8px' }}>Use the platform only for lawful healthcare-related purposes</li>
              <li style={{ marginBottom: '8px' }}>Respect the privacy and rights of doctors and other users</li>
              <li style={{ marginBottom: '8px' }}>Not attempt to access accounts or data belonging to others</li>
              <li style={{ marginBottom: '8px' }}>Not use the platform to spread misinformation about healthcare</li>
            </ul>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Medical Disclaimer</h2>
            <p>HELA LANKA is a connection platform and does not provide medical advice. The information and services provided through our platform are for informational purposes only. Always consult a qualified healthcare professional for medical decisions. We are not responsible for any medical outcomes resulting from consultations arranged through our platform.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Doctor Verification</h2>
            <p>We make efforts to verify the credentials of healthcare professionals listed on our platform. However, we do not guarantee the accuracy of all information provided by doctors. Users are encouraged to perform their own due diligence before making healthcare decisions.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Intellectual Property</h2>
            <p>All content on the HELA LANKA platform, including text, graphics, logos, and software, is the property of HELA LANKA and is protected by Sri Lankan and international copyright laws. Unauthorized reproduction or distribution is prohibited.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Limitation of Liability</h2>
            <p>HELA LANKA shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or inability to access our services. Our total liability shall not exceed the amount paid by you for use of our services in the past 12 months.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify registered users of significant changes via email.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Contact Us</h2>
            <p>For questions about these Terms of Service, please contact:</p>
            <div style={{ background: '#f0fdf4', borderLeft: '4px solid #16a34a', padding: '16px 20px', borderRadius: '8px', marginTop: '12px' }}>
              <p style={{ margin: 0 }}>📧 https://codebuilder.it.com<br />📞 +94 76 747 2935</p>
            </div>
          </section>

          {/* Navigation links */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '28px', marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: '#15803d', textDecoration: 'none', fontWeight: '600' }}>← Privacy Policy</Link>
            <Link to="/cookie-policy" style={{ color: '#15803d', textDecoration: 'none', fontWeight: '600' }}>Cookie Policy →</Link>
            <Link to="/" style={{ color: '#6b7280', textDecoration: 'none', marginLeft: 'auto' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;