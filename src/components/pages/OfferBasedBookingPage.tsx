import React, { useState } from 'react';
import PayPalPayment from '../payments/PayPalPayment';
import lotusLogo from '../../assets/lotus-each-album.png';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  eventDate: string;
  eventType: string;
  offer: string;
  offerAmount: string;
  description: string;
  documents: FileList | null;
}

const OfferBasedBookingPage: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    instagram: '',
    tiktok: '',
    twitter: '',
    eventDate: '',
    eventType: '',
    offer: '',
    offerAmount: '',
    description: '',
    documents: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const eventTypes = [
    'Live Performance',
    'Music Feature/Collaboration',
    'Photoshoot',
    'Video Shoot',
    'Special Event',
    'Private Performance',
    'Corporate Event',
    'Festival Performance',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, documents: e.target.files }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Show PayPal payment first before submitting booking
      setShowPayment(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error preparing booking:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (details: any) => {
    try {
      // Payment successful, now submit the booking
      const bookingData = {
        ...formData,
        paymentDetails: details,
        consultationFee: 25.00,
        submittedAt: new Date().toISOString(),
        status: 'pending_review'
      };

      console.log('Booking submitted with payment:', bookingData);
      
      // Here you would save to Firebase/database
      // await saveBookingToDatabase(bookingData);
      
      setSubmitStatus('success');
      setPaymentCompleted(true);
      setShowPayment(false);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        instagram: '',
        tiktok: '',
        twitter: '',
        eventDate: '',
        eventType: '',
        offer: '',
        offerAmount: '',
        description: '',
        documents: null
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('PayPal payment error:', error);
    setSubmitStatus('error');
    setShowPayment(false);
  };

  return (
    <section className="section">
      <h1 className="section-title">Book Red Lotus</h1>
      <p className="section-subtitle">Make an offer for performances, collaborations, shoots, and special engagements</p>

      <div className="mt-2xl">
        {/* Services Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-base md:text-lg font-semibold text-red-500 mb-2">Live Performances</h3>
            <p className="text-grey-600 text-xs md:text-sm">Concerts, festivals, private events</p>
          </div>
          <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-amber-500 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-base md:text-lg font-semibold text-amber-600 mb-2">Collaborations</h3>
            <p className="text-grey-600 text-xs md:text-sm">Features, songwriting, production</p>
          </div>
          <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-base md:text-lg font-semibold text-blue-600 mb-2">Photo/Video</h3>
            <p className="text-grey-600 text-xs md:text-sm">Professional shoots, music videos</p>
          </div>
          <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-base md:text-lg font-semibold text-purple-600 mb-2">Special Events</h3>
            <p className="text-grey-600 text-xs md:text-sm">Corporate, private, custom experiences</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-4 md:p-8 border-l-4 border-red-500 shadow-md">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-black">
              Submit Your Booking Offer
            </h2>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6">
                <p className="text-green-700 text-center font-medium">
                  ✅ Your booking request has been submitted! We'll review your offer and get back to you within 24-48 hours.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-center font-medium">
                  ❌ There was an error submitting your request. Please try again or contact us directly.
                </p>
              </div>
            )}            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-grey-800 text-sm font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-grey-800 text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-grey-800 text-sm font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-grey-800 text-sm font-semibold mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                    placeholder="Company or venue name"
                  />
                </div>
              </div>              {/* Social Media Handles */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-black mb-3 md:mb-4">📱 Social Media Handles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-grey-800 text-sm font-semibold mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-grey-800 text-sm font-semibold mb-2">
                      TikTok
                    </label>
                    <input
                      type="text"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-grey-800 text-sm font-semibold mb-2">
                      Twitter/X
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                      placeholder="@yourusername"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-grey-800 text-sm font-semibold mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-grey-800 text-sm font-semibold mb-2">
                    Proposed Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                  />
                </div>
              </div>

              {/* Offer Details */}
              <div>
                <label className="block text-grey-800 text-sm font-semibold mb-2">
                  Your Offer Amount *
                </label>
                <input
                  type="text"
                  name="offerAmount"
                  value={formData.offerAmount}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                  placeholder="e.g., $5,000 USD"
                />
              </div>              <div>
                <label className="block text-grey-800 text-sm font-semibold mb-2">
                  Event Description & Additional Details *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation"
                  placeholder="Describe your event, venue details, audience size, technical requirements, and any other relevant information..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-grey-800 text-sm font-semibold mb-2">
                  Upload Documents
                </label>
                <input
                  type="file"
                  name="documents"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.mp4,.zip"
                  className="w-full bg-white border border-grey-300 rounded-lg px-4 py-3 text-black focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 touch-manipulation file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600"
                />
                <p className="text-grey-600 text-xs md:text-sm mt-2">
                  Upload music, event flyers, venue info, or other relevant documents (PDF, DOC, images, audio, video)
                </p>
              </div>

              {/* Payment Information */}
              <div className="bg-blue-50 rounded-lg p-4 md:p-6 border-l-4 border-blue-500">
                <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-3">
                  💳 Booking Consultation Fee: $25 USD
                </h3>
                <p className="text-grey-700 text-xs md:text-sm mb-3">
                  A non-refundable consultation fee is required to process your booking request. 
                  This ensures serious inquiries and covers our time reviewing your proposal.
                </p>
                <p className="text-blue-700 text-xs md:text-sm font-medium">
                  Fee is credited toward your final booking if we accept your offer!
                </p>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-grey-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 md:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 touch-manipulation w-full md:w-auto shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing Payment...
                    </span>
                  ) : (
                    'Submit Offer & Pay Consultation Fee'
                  )}
                </button>
              </div>

              <div className="text-center text-grey-600 text-xs md:text-sm">
                <p>By submitting this form, you agree to our terms and conditions.</p>
                <p>We typically respond to booking requests within 24-48 hours.</p>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-black">
            ❓ Frequently Asked Questions
          </h3>
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-red-500 shadow-md">
              <h4 className="text-base md:text-lg font-semibold text-red-500 mb-3">
                How does the booking process work?
              </h4>
              <p className="text-grey-700 text-sm md:text-base">
                Submit your offer with the consultation fee. We review all submissions within 24-48 hours. 
                If we're interested, we'll contact you to discuss details and negotiate terms.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-red-500 shadow-md">
              <h4 className="text-base md:text-lg font-semibold text-red-500 mb-3">
                What types of events do you accept?
              </h4>
              <p className="text-grey-700 text-sm md:text-base">
                We consider all types of professional opportunities including live performances, 
                collaborations, photo/video shoots, corporate events, and special engagements.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-red-500 shadow-md">
              <h4 className="text-base md:text-lg font-semibold text-red-500 mb-3">
                Is the consultation fee refundable?
              </h4>
              <p className="text-grey-700 text-sm md:text-base">
                The $25 consultation fee is non-refundable, but if we accept your booking, 
                this amount will be credited toward your final payment.
              </p>
            </div>
        </div>
      </div>

      {/* PayPal Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold text-black mb-4">
              Complete Payment
            </h3>
            <p className="text-grey-700 mb-4">
              Please complete the $25 consultation fee to submit your booking request.
            </p>
            
            <PayPalPayment
              amount={25}
              productTitle="Red Lotus Booking Consultation"
              productType="ticket"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            
            <button
              onClick={() => setShowPayment(false)}
              className="mt-4 w-full bg-grey-300 text-black py-2 px-4 rounded hover:bg-grey-400 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg max-w-md shadow-lg">
            <h3 className="font-bold text-lg mb-2">✅ Booking Submitted Successfully!</h3>
            <p>Your booking request has been received. We'll review your offer and contact you within 24-48 hours.</p>
            <button
              onClick={() => setSubmitStatus(null)}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg max-w-md shadow-lg">
            <h3 className="font-bold text-lg mb-2">❌ Submission Error</h3>
            <p>There was an error processing your booking. Please try again.</p>
            <button
              onClick={() => setSubmitStatus(null)}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </section>
  );
};

export default OfferBasedBookingPage;
