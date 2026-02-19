import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍪</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 12px' }}>Cookie Policy</h1>
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences and understanding how you use our platform.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>How We Use Cookies</h2>
            <p>HELA LANKA uses cookies for the following purposes:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}><strong>Essential Cookies:</strong> Required for the website to function properly, including login sessions and security.</li>
              <li style={{ marginBottom: '8px' }}><strong>Preference Cookies:</strong> Remember your language, region, and display settings.</li>
              <li style={{ marginBottom: '8px' }}><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website to improve our services.</li>
              <li style={{ marginBottom: '8px' }}><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Managing Cookies</h2>
            <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website. To manage cookies, you can:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>Access your browser's privacy or security settings</li>
              <li style={{ marginBottom: '8px' }}>Choose to block or delete cookies at any time</li>
              <li style={{ marginBottom: '8px' }}>Set preferences for specific websites</li>
            </ul>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Third-Party Cookies</h2>
            <p>Some cookies on our platform may be placed by third-party services such as analytics providers (e.g., Google Analytics) or social media platforms. These third parties have their own privacy policies governing how they use such information.</p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>Contact Us</h2>
            <p>If you have questions about our Cookie Policy, please contact us at:</p>
            <div style={{ background: '#f0fdf4', borderLeft: '4px solid #16a34a', padding: '16px 20px', borderRadius: '8px', marginTop: '12px' }}>
              <p style={{ margin: 0 }}>📧 https://codebuilder.it.com<br />📞 +94 76 747 2935</p>
            </div>
          </section>

          {/* Navigation links */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '28px', marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: '#15803d', textDecoration: 'none', fontWeight: '600' }}>← Privacy Policy</Link>
            <Link to="/terms-of-service" style={{ color: '#15803d', textDecoration: 'none', fontWeight: '600' }}>Terms of Service →</Link>
            <Link to="/" style={{ color: '#6b7280', textDecoration: 'none', marginLeft: 'auto' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;