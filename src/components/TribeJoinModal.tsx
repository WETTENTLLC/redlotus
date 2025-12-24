import React, { useState } from 'react';
import lotusLogo from '../assets/lotus-each-album.png';

interface TribeJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  tribe: 'red' | 'yellow' | 'blue';
  onJoinSuccess: (memberData: any) => void;
}

const TribeJoinModal: React.FC<TribeJoinModalProps> = ({ isOpen, onClose, tribe, onJoinSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tribeInfo = {
    red: { name: 'Red Lotus', color: 'bg-red-lotus', season: 'Winter' },
    yellow: { name: 'Yellow Lotus', color: 'bg-yellow-lotus', season: 'Summer' },
    blue: { name: 'Blue Lotus', color: 'bg-blue-lotus', season: 'Spring' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simple local storage approach to avoid Firebase issues
      const memberData = {
        ...formData,
        tribe,
        joinedAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      // Store in localStorage
      const existingMembers = JSON.parse(localStorage.getItem('tribemembers') || '[]');
      existingMembers.push(memberData);
      localStorage.setItem('tribemembers', JSON.stringify(existingMembers));

      // Store current user's tribe membership
      localStorage.setItem('currentTribeMember', JSON.stringify(memberData));

      onJoinSuccess(memberData);
      onClose();
    } catch (error) {
      console.error('Error joining tribe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Join {tribeInfo[tribe].name} Tribe</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${tribeInfo[tribe].color} flex items-center justify-center`}>
          <img src={lotusLogo} alt="Lotus" className="w-10 h-8 filter brightness-0 invert" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Why did you choose {tribeInfo[tribe].name} tribe?</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-white focus:outline-none resize-none"
              placeholder="Share what draws you to this tribe..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded font-bold text-white transition-all ${
              isSubmitting ? 'bg-gray-600 cursor-not-allowed' : `${tribeInfo[tribe].color} hover:opacity-80`
            }`}
          >
            {isSubmitting ? 'Joining...' : `Join ${tribeInfo[tribe].name} Tribe`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TribeJoinModal;