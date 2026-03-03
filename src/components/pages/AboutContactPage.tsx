import React, { useState } from 'react';

const AboutContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend service
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* About Section */}
      <section style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#b71c1c' }}>About Red Lotus</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#333', marginBottom: '20px' }}>
          Red Lotus is an official music collective dedicated to creating innovative, boundary-pushing content across
          multiple genres and artistic expressions. We bring together talented artists, producers, and creators to
          collaborate and produce unique musical experiences.
        </p>

        <h2 style={{ marginTop: '40px', marginBottom: '15px' }}>Our Mission</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555' }}>
          We are committed to fostering a creative community where artists can express themselves, connect with fans,
          and build a sustainable presence in the digital music landscape. Through our platform, we offer exclusive
          content, merchandise, community engagement, and live experiences.
        </p>

        <h2 style={{ marginTop: '40px', marginBottom: '15px' }}>Our Tribes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', borderLeft: '4px solid #b71c1c' }}>
            <h3 style={{ color: '#b71c1c' }}>Red Lotus</h3>
            <p>Winter energy and focused motivation. Hip-hop and rap excellence.</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', borderLeft: '4px solid #fbc02d' }}>
            <h3 style={{ color: '#fbc02d' }}>Yellow Lotus</h3>
            <p>Summer energy and uplifting positivity. Pop and crossover hits.</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', borderLeft: '4px solid #1976d2' }}>
            <h3 style={{ color: '#1976d2' }}>Blue Lotus</h3>
            <p>Spring renewal and calm reflection. R&B and soul music.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '30px', color: '#333' }}>Get in Touch</h2>

        {submitted && (
          <div
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            ✓ Thank you for your message! We'll get back to you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="What is this regarding?"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              placeholder="Your message here..."
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 30px',
              backgroundColor: '#b71c1c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#8b1515';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b71c1c';
            }}
          >
            Send Message
          </button>
        </form>

        <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid #ddd' }}>
          <h3 style={{ marginBottom: '15px' }}>Direct Contact</h3>
          <p style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>
            <strong>Email:</strong> contact@redlotus.music
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            We typically respond within 24-48 hours during business hours.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutContactPage;
