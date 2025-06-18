import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-yellow-lotus text-black py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Contact Red Lotus</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Connect with us for collaborations, bookings, and inquiries
            </p>
          </div>
        </section>

        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-red-lotus">Send us a Message</h2>
                {submitted && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-lotus"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-lotus"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-lotus"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-lotus"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-red-lotus text-white py-3 px-6 rounded-md font-bold hover:bg-red-700 transition"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information & Booking */}
              <div className="space-y-8">
                
                {/* Professional Booking */}
                <div className="bg-red-lotus rounded-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-4">Professional Bookings</h3>
                  <p className="mb-4">
                    Looking to book Red Lotus for performances, features, or special events? 
                    Use our offer-based booking system to submit your proposal.
                  </p>
                  <a 
                    href="/offer-booking" 
                    className="inline-block bg-white text-red-lotus px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
                  >
                    Submit Booking Offer
                  </a>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-red-lotus">Follow Us</h3>
                  <div className="space-y-3">
                    <a 
                      href="https://www.instagram.com/red.lotus.music" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-red-lotus transition"
                    >
                      <span className="mr-3 text-xl">📷</span>
                      @red.lotus.music on Instagram
                    </a>
                    <a 
                      href="https://www.tiktok.com/@red.lotus.music" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-red-lotus transition"
                    >
                      <span className="mr-3 text-xl">🎵</span>
                      @red.lotus.music on TikTok
                    </a>
                    <a 
                      href="https://www.youtube.com/@redlotusmusic" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-red-lotus transition"
                    >
                      <span className="mr-3 text-xl">📺</span>
                      Red Lotus Music on YouTube
                    </a>
                  </div>
                </div>

                {/* General Info */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-red-lotus">Get in Touch</h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Management:</strong> For business inquiries and collaborations
                    </p>
                    <p>
                      <strong>Press:</strong> Media and interview requests
                    </p>
                    <p>
                      <strong>Fans:</strong> General questions and feedback
                    </p>
                    <p className="text-sm mt-4">
                      We aim to respond to all inquiries within 48 hours. 
                      For urgent booking requests, please use our booking system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
