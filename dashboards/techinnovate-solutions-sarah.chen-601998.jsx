import { useState, useEffect } from 'react';

export default function LeadTechinnovate-solutions-sarah.chen-601998Dashboard() {
  const [leadStatus, setLeadStatus] = useState('active');
  const [isHot, setIsHot] = useState(true);
  const [followUpScheduled, setFollowUpScheduled] = useState(false);

  const leadData = {
  "id": "lead_1749735601997_brqm5q95d",
  "slug": "techinnovate-solutions-sarah.chen-601998",
  "email": "sarah.chen@techinnovate.com",
  "company": "TechInnovate Solutions",
  "firstName": "Sarah",
  "lastName": "Chen",
  "phone": "+1-555-0987",
  "industry": "technology",
  "companySize": "medium",
  "interestLevel": "high",
  "source": "demo_request",
  "capturedAt": "2025-06-12T13:40:01.997Z",
  "interactions": [
    {
      "type": "lead_captured",
      "timestamp": "2025-06-12T13:40:01.997Z",
      "details": "Lead captured from demo_request",
      "value": 80
    },
    {
      "type": "initial_message",
      "timestamp": "2025-06-12T13:40:01.997Z",
      "details": "We are interested in scheduling a demo to see how your quantum analytics platform can help optimize our portfolio management strategies. Please contact us to arrange a consultation.",
      "value": 40
    }
  ],
  "qnisScore": 94,
  "leadVelocity": 1209600000
};
  const qnisMetrics = {
  "quality": 100,
  "need": 85,
  "interest": 100,
  "scale": 70,
  "overall": 94
};

  const handleMarkAsHot = async () => {
    try {
      const response = await fetch('/api/leads/mark-hot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadData.id, isHot: !isHot })
      });
      
      if (response.ok) {
        setIsHot(!isHot);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const handleAutoFollowUp = async () => {
    try {
      const response = await fetch('/api/leads/auto-follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadData.id })
      });
      
      if (response.ok) {
        setFollowUpScheduled(true);
        setTimeout(() => setFollowUpScheduled(false), 3000);
      }
    } catch (error) {
      console.error('Failed to schedule follow-up:', error);
    }
  };

  const handleConvertToDeal = async () => {
    try {
      const response = await fetch('/api/leads/convert-to-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadData.id })
      });
      
      if (response.ok) {
        setLeadStatus('converted');
        window.location.href = '/deals/' + leadData.id;
      }
    } catch (error) {
      console.error('Failed to convert lead:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {leadData.firstName} {leadData.lastName}
              </h1>
              <p className="text-gray-400">{leadData.company} • {leadData.industry}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                QNIS: {qnisMetrics.overall}
              </div>
              {isHot && (
                <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  🔥 Hot Lead
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Quality</h3>
              <span className="text-2xl font-bold text-green-400">
                {qnisMetrics.quality}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                style={{ width: `${qnisMetrics.quality}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Need</h3>
              <span className="text-2xl font-bold text-purple-400">
                {qnisMetrics.need}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                style={{ width: `${qnisMetrics.need}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Interest</h3>
              <span className="text-2xl font-bold text-yellow-400">
                {qnisMetrics.interest}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" 
                style={{ width: `${qnisMetrics.interest}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Scale</h3>
              <span className="text-2xl font-bold text-cyan-400">
                {qnisMetrics.scale}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full" 
                style={{ width: `${qnisMetrics.scale}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleMarkAsHot}
            className={`py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              isHot 
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
            }`}
          >
            {isHot ? '🔥 Remove Hot Status' : '🔥 Mark as Hot'}
          </button>

          <button
            onClick={handleAutoFollowUp}
            disabled={followUpScheduled}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {followUpScheduled ? '✓ Follow-Up Scheduled' : '📧 Auto Follow-Up'}
          </button>

          <button
            onClick={handleConvertToDeal}
            disabled={leadStatus === 'converted'}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {leadStatus === 'converted' ? '✓ Converted to Deal' : '💰 Convert to Deal'}
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Lead Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-4">Contact Details</h4>
              <div className="space-y-2 text-gray-400">
                <p><span className="text-white">Email:</span> {leadData.email}</p>
                {leadData.phone && <p><span className="text-white">Phone:</span> {leadData.phone}</p>}
                <p><span className="text-white">Company Size:</span> {leadData.companySize}</p>
                <p><span className="text-white">Interest Level:</span> {leadData.interestLevel}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-4">Engagement History</h4>
              <div className="space-y-2 text-gray-400">
                <p><span className="text-white">Captured:</span> {new Date(leadData.capturedAt).toLocaleDateString()}</p>
                <p><span className="text-white">Total Interactions:</span> {leadData.interactions?.length || 0}</p>
                <p><span className="text-white">Conversion Probability:</span> {Math.round(qnisMetrics.overall * 0.8)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}