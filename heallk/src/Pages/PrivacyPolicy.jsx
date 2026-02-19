import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 12px' }}>Privacy Policy</h1>
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Introduction</h2>
            <p>HELA LANKA ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform to connect with Ayurvedic healthcare professionals across Sri Lanka.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}><strong>Personal Information:</strong> Name, email address, phone number, and profile details you provide during registration.</li>
              <li style={{ marginBottom: '8px' }}><strong>Health Information:</strong> Information you share when searching for or consulting with doctors (treated with the highest confidentiality).</li>
              <li style={{ marginBottom: '8px' }}><strong>Usage Data:</strong> Pages visited, features used, and time spent on the platform.</li>
              <li style={{ marginBottom: '8px' }}><strong>Device Information:</strong> IP address, browser type, and operating system.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>Provide and improve our healthcare connection services</li>
              <li style={{ marginBottom: '8px' }}>Verify doctor credentials and maintain quality standards</li>
              <li style={{ marginBottom: '8px' }}>Process appointments and facilitate consultations</li>
              <li style={{ marginBottom: '8px' }}>Send service updates, reminders, and important notifications</li>
              <li style={{ marginBottom: '8px' }}>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal data, including SSL encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us using the information below.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Contact Us</h2>
            <p>For privacy-related questions or concerns, please reach out to us:</p>
            <div style={{ background: '#f0fdf4', borderLeft: '4px solid #16a34a', padding: '16px 20px', borderRadius: '8px', marginTop: '12px' }}>
              <p style={{ margin: 0 }}>📧 https://codebuilder.it.com<br />📞 +94 76 747 2935</p>
            </div>
          </section>

          {/* Navigation links */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '28px', marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/terms-of-service" style={{ color: '#15803d', textDecoration: 'none', fontWeight: '600' }}>Terms of Service →</Link>
            <Link to="/cookie-policy" style={{ color: '#15803d', textDecoration: 'none', fontWeight: '600' }}>Cookie Policy →</Link>
            <Link to="/" style={{ color: '#6b7280', textDecoration: 'none', marginLeft: 'auto' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;