import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8081/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: process.env.REACT_APP_EMAIL_TO || 'your-email@example.com', // You can set this in .env
          subject: `New Contact Form Submission from ${form.name}`,
          message: `
Name: ${form.name}
Email: ${form.email}
Message: ${form.message}
          `.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError(data.message || 'Failed to send email. Please try again.');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact" style={{ padding: '40px 0', textAlign: 'center' }}>
      <h2>Contact Us</h2>
      {submitted ? (
        <div>
          <p style={{ color: 'green' }}>Thank you for reaching out! We will get back to you soon.</p>
          <button 
            onClick={() => setSubmitted(false)}
            style={{ 
              padding: 8, 
              background: 'var(--gold)', 
              color: 'var(--black)', 
              border: 'none', 
              borderRadius: 4, 
              fontWeight: 'bold',
              marginTop: 16,
              cursor: 'pointer'
            }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '32px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input 
            name="name" 
            type="text" 
            placeholder="Your Name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            style={{ padding: 10, borderRadius: 4, border: '1px solid #ccc' }} 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Your Email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            style={{ padding: 10, borderRadius: 4, border: '1px solid #ccc' }} 
          />
          <textarea 
            name="message" 
            placeholder="Your Message" 
            value={form.message} 
            onChange={handleChange} 
            required 
            style={{ padding: 10, borderRadius: 4, border: '1px solid #ccc', minHeight: 80 }} 
          />
          {error && (
            <p style={{ color: 'red', margin: 0, fontSize: '14px' }}>{error}</p>
          )}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: 12, 
              background: loading ? '#ccc' : 'var(--gold)', 
              color: 'var(--black)', 
              border: 'none', 
              borderRadius: 4, 
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </section>
  );
};

export default Contact; 
