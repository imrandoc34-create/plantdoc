export const diseasesData = [
  {
    id: 'd1',
    name: 'Early Blight',
    symptoms: ['Brown spots', 'Yellowing leaves', 'Lesions on stems'],
    treatment: 'Apply copper-based fungicides. Remove affected lower leaves. Ensure proper air circulation.',
    causes: 'Caused by the fungus Alternaria solani. It spreads quickly in warm, humid weather and wet foliage.',
    severityPct: 85,
    prevention: 'Water at the base of the plant to keep leaves dry. Crop rotation and staking plants to improve airflow.'
  },
  {
    id: 'd2',
    name: 'Powdery Mildew',
    symptoms: ['White powdery residue', 'Curled leaves', 'Stunted growth'],
    treatment: 'Use neem oil or sulfur-based fungicides. Avoid overhead watering. Increase spacing.',
    causes: 'Caused by various fungal spores that thrive in dry, warm climates with high humidity at night.',
    severityPct: 60,
    prevention: 'Provide full sun, adequate spacing for airflow, and avoid late-day watering.'
  },
  {
    id: 'd3',
    name: 'Root Rot',
    symptoms: ['Wilting', 'Yellowing leaves', 'Stunted growth', 'Dark mushy roots'],
    treatment: 'Improve soil drainage. Reduce watering frequency. Apply beneficial mycorrhizae.',
    causes: 'Typically caused by overwatering or poorly draining soil, leading to a lack of oxygen and fungal overgrowth (like Pythium).',
    severityPct: 95,
    prevention: 'Ensure well-draining soil, use pots with drainage holes, and let the top inch of soil dry out between waterings.'
  },
  {
    id: 'd4',
    name: 'Aphid Infestation',
    symptoms: ['Curled leaves', 'Sticky residue on leaves', 'Visible small insects'],
    treatment: 'Spray with insecticidal soap or neem oil. Introduce ladybugs as natural predators.',
    causes: 'Aphids are attracted to soft, new growth and high nitrogen levels in the plant.',
    severityPct: 40,
    prevention: 'Monitor regularly, avoid over-fertilizing with nitrogen, and plant companion plants like marigolds.'
  },
  {
    id: 'd5',
    name: 'Bacterial Spot',
    symptoms: ['Dark spots with yellow halos', 'Defoliation', 'Brown spots'],
    treatment: 'Apply copper sprays early. Avoid working around plants when wet. Use disease-free seeds.',
    causes: 'Caused by Xanthomonas bacteria, which enters through natural openings or wounds, spreading via splashing rain.',
    severityPct: 75,
    prevention: 'Avoid overhead watering, sanitize gardening tools, and rotate crops every 2-3 years.'
  },
  {
    id: 'd6',
    name: 'Nitrogen Deficiency',
    symptoms: ['Yellowing leaves', 'Stunted growth', 'Pale green overall color'],
    treatment: 'Apply blood meal or a balanced fertilizer high in nitrogen. Add organic compost.',
    causes: 'Depleted soil nutrients, often due to poor soil health, over-farming, or heavy rainfall washing away nutrients.',
    severityPct: 50,
    prevention: 'Routinely amend soil with compost, use cover crops like clover, and apply a slow-release organic fertilizer.'
  }
];

export const allSymptoms = [
  'Brown spots',
  'Yellowing leaves',
  'Lesions on stems',
  'White powdery residue',
  'Curled leaves',
  'Stunted growth',
  'Wilting',
  'Dark mushy roots',
  'Sticky residue on leaves',
  'Visible small insects',
  'Dark spots with yellow halos',
  'Defoliation',
  'Pale green overall color'
];
