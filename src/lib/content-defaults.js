// Default site content. Anything the admin edits is saved to Vercel Blob (content.json)
// and merged over these defaults, so a missing/blank saved value falls back to this file.
export const defaultContent = {
  business: {
    name: 'PVR Energy',
    tagline: 'Solutions',
    whatsapp: '919036099917',
    phoneDisplay: '+91 90360 99917',
    email: 'info@pvrenergysolutions.in',
    location: 'Bangalore, Karnataka',
    address: 'Bangalore, Karnataka — 560100',
    serviceAreas: 'Serving: Electronic City, Anekal, Attibele, Jigani, Hosa Road',
    hours: 'Monday – Saturday: 9:00 AM – 6:00 PM\nSunday: On appointment only',
    footerHours: 'Mon–Sat: 9AM–6PM',
    footerAbout:
      "Bangalore's trusted solar installation company. Serving Electronic City, Anekal, Attibele, Jigani and surrounding areas since 2022."
  },

  hero: {
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=70',
        tag: '🏠 Residential Solar',
        title: 'Power Your Home\nwith Clean Solar Energy',
        sub: 'Serving Electronic City · Anekal · Attibele · Jigani · Bangalore Rural',
        bottomStat: '₹2K–8K',
        bottomLabel: 'Saved every month on electricity bills'
      },
      {
        image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1600&q=70',
        tag: '🏭 Commercial & Industrial',
        title: 'Energy Independence\nfor Your Business',
        sub: 'Large-scale rooftop installations for factories, warehouses & IT parks',
        bottomStat: '50+',
        bottomLabel: 'Commercial & industrial projects completed'
      },
      {
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1600&q=70',
        tag: '✅ BESCOM Approved',
        title: 'Hassle-Free Approvals\n& Govt. Subsidy Assistance',
        sub: 'We handle net metering, documentation and subsidy claims end-to-end',
        bottomStat: '100%',
        bottomLabel: 'Paperwork & approvals fully handled for you'
      },
      {
        image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=70',
        tag: '⭐ Trusted Since 2022',
        title: "Bangalore's Trusted\nSolar Energy Partner",
        sub: 'Certified technicians, premium panels, 25-year warranty',
        bottomStat: '3+',
        bottomLabel: 'Years serving South Bangalore'
      }
    ],
    tags: ['BESCOM Approved', 'Subsidy Assistance', '25 Year Panel Warranty', 'Free Consultation'],
    kannada: {
      title: 'ನಿಮ್ಮ ಮನೆಗೆ\nಸೌರ ಶಕ್ತಿ ತನ್ನಿ',
      sub: 'ಸ್ವಚ್ಛ ಮತ್ತು ಉಳಿತಾಯದ ವಿದ್ಯುತ್',
      points: [
        'ಉಚಿತ ಸೈಟ್ ಭೇಟಿ ಮತ್ತು ಅಂದಾಜು',
        'BESCOM ಅನುಮೋದಿತ ಸ್ಥಾಪನೆ',
        'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಸಹಾಯ',
        'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ · ಆನೇಕಲ್ · ಅತ್ತಿಬೆಲೆ'
      ],
      button: 'ಇಂದೇ ಸಂಪರ್ಕಿಸಿ →'
    }
  },

  stats: [
    { num: '50+', label: 'Projects Completed' },
    { num: '3+', label: 'Years in Bangalore' },
    { num: '15+', label: 'Expert Technicians' },
    { num: '100%', label: 'Customer Satisfaction' }
  ],

  about: {
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=700&q=80',
    badgeNum: '3+',
    badgeLabel: 'Years Serving\nBangalore',
    title: "Bangalore's Local\nSolar Energy Experts",
    paragraphs: [
      'PVR Energy Solutions is a Bangalore-based company committed to helping homes, businesses, and industries in South Bangalore transition to clean, reliable and cost-efficient solar energy.',
      'We specialise in solar rooftop installations across Electronic City, Anekal, Attibele, Jigani, Hosa Road and the Bangalore Rural district.',
      'Our team handles everything: BESCOM net-metering approvals, Karnataka government subsidy applications, structural survey, premium panel sourcing and post-installation AMC support.'
    ],
    highlights: [
      { icon: '🏆', title: 'BESCOM Empanelled', sub: 'Approved vendor for net metering' },
      { icon: '💰', title: 'Subsidy Assistance', sub: 'PM Surya Ghar & State schemes' },
      { icon: '🔧', title: 'End-to-End Service', sub: 'Survey → Install → AMC' },
      { icon: '📍', title: 'Local Team', sub: 'Based in South Bangalore' }
    ]
  },

  services: [
    { icon: '☀️', title: 'Rooftop Solar Installation', desc: 'Efficient solar systems for homes and businesses across Bangalore. We handle everything from Anekal to Electronic City — site survey, design, installation and commissioning.', badge: 'Most Popular' },
    { icon: '🏠', title: 'Residential Solar Solutions', desc: 'Help your family go solar with customised residential systems. Save ₹2,000–₹8,000 on monthly electricity bills. Ideal for homes in Attibele, Jigani & surrounding areas.', badge: '' },
    { icon: '🏭', title: 'Commercial Solar Systems', desc: 'Large-scale solar installations for factories, warehouses, IT parks and offices. Achieve energy independence and reduce operational costs significantly.', badge: '' },
    { icon: '🚿', title: 'Solar Water Heaters', desc: 'Eco-friendly solar water heating for homes and apartments. Consistent hot water supply throughout the year at minimal running cost.', badge: '' },
    { icon: '💧', title: 'Water Softeners & Purifiers', desc: "Advanced water treatment systems that tackle Bangalore's hard water problem. Protect your appliances, pipes and health with our certified systems.", badge: 'Bangalore Special' },
    { icon: '🔋', title: 'UPS & Power Backup', desc: 'Reliable UPS and power backup solutions to keep your home or office running during frequent power cuts in Bangalore outskirts.', badge: '' }
  ],

  workflow: [
    { num: '01', title: 'Free Site Visit', desc: 'Our expert visits your property in Bangalore, inspects the rooftop, measures shadow-free area, and analyses your electricity bill to size the right system.' },
    { num: '02', title: 'Custom Design & Quote', desc: 'We prepare a detailed proposal with system capacity, panel layout, expected generation, ROI and estimated payback period — all transparent and jargon-free.' },
    { num: '03', title: 'Professional Installation', desc: 'Certified technicians install premium panels and equipment. We handle BESCOM/BMRDA approvals, net metering and all documentation.' },
    { num: '04', title: 'Handover & Support', desc: 'System testing, commissioning, and a comprehensive handover. Ongoing maintenance, remote monitoring and dedicated WhatsApp support.' }
  ],

  testimonials: [
    { name: 'Manjunath R.', location: 'Anekal, Bangalore', text: 'Got a water de-scaler installed for our home. The water quality has improved remarkably and maintenance has reduced. Highly recommended!' },
    { name: 'Sandeep Shetty', location: 'Electronic City Phase 2', text: 'PVR Energy helped with solar installation for our shop. They explained everything clearly, completed on time, and delivered exactly as promised.' },
    { name: 'Ravi Kumar S.', location: 'Electronic City, Bangalore', text: 'Installed a 5kW solar rooftop for our office. Professional team, smooth process — already seeing a 60% drop in electricity bills. Excellent!' },
    { name: 'Priya N.', location: 'Attibele, Bangalore', text: 'Very happy with their UPS solution. Power cuts were a big issue in Attibele, but now everything runs smoothly. Quick installation and great support.' }
  ]
};

/**
 * Deep-merge saved content over defaults. Objects merge key by key;
 * arrays and primitives from `saved` replace the default wholesale.
 */
export function mergeContent(defaults, saved) {
  if (saved === undefined || saved === null) return defaults;
  if (Array.isArray(defaults) || typeof defaults !== 'object') {
    return Array.isArray(defaults) === Array.isArray(saved) && typeof defaults === typeof saved
      ? saved
      : defaults;
  }
  const out = {};
  for (const key of Object.keys(defaults)) {
    out[key] = mergeContent(defaults[key], saved[key]);
  }
  return out;
}
