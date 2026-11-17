const { query } = require('../database/db');

// Kerala Department mappings and taxonomy
const DEPARTMENT_TAXONOMY = {
  PWD: {
    name: 'Public Works Department (PWD)',
    categories: ['Road Infrastructure', 'Bridges & Culverts', 'Government Buildings', 'Pothole Repair', 'Footpaths & Drainage'],
    keywords: ['road', 'pothole', 'bridge', 'culvert', 'tarring', 'blacktopping', 'highway', 'tar', 'asphalt', 'divider', 'traffic signal', 'bypass', 'pavement']
  },
  HEALTH: {
    name: 'Health & Family Welfare Department',
    categories: ['Public Healthcare', 'Medicine Shortage', 'Hospital Facilities', 'Doctors & Staff', 'Epidemic / Disease Outbreak'],
    keywords: ['hospital', 'doctor', 'medicine', 'insulin', 'dialysis', 'clinic', 'health centre', 'phc', 'ambulance', 'nurse', 'pharmacy', 'patient', 'dengue', 'fever', 'medical']
  },
  LSGD: {
    name: 'Local Self Government Department (LSGD)',
    categories: ['Sanitation & Drainage', 'Waste Management', 'Streetlights', 'Building Permits', 'Panchayat Services', 'Local Roads'],
    keywords: ['garbage', 'waste', 'drain', 'drainage', 'sewage', 'panchayat', 'municipality', 'corporation', 'streetlight', 'street light', 'litter', 'plastic', 'stray dog', 'cleaning', 'canal']
  },
  KSEB: {
    name: 'Kerala State Electricity Board (KSEB)',
    categories: ['Electricity & Power', 'Transformer Faults', 'Power Outages', 'Dangerous Electric Poles', 'Billing Disputes'],
    keywords: ['electricity', 'power', 'current', 'wire', 'pole', 'transformer', 'kseb', 'meter', 'high voltage', 'blackout', 'short circuit', 'electrocution', 'phase']
  },
  KWA: {
    name: 'Kerala Water Authority (KWA)',
    categories: ['Drinking Water Supply', 'Pipeline Leakage', 'Water Quality & Contamination', 'Jal Jeevan Mission', 'Sewerage'],
    keywords: ['water', 'pipe', 'pipeline', 'drinking water', 'tap', 'leak', 'burst', 'kwa', 'contamination', 'muddy water', 'tanker', 'shortage', 'scarcity']
  },
  REVENUE: {
    name: 'Revenue & Land Records Department',
    categories: ['Land & Revenue', 'Pokkuvaravu / Mutation', 'Land Survey & Boundary', 'Pattayam', 'Disaster Relief & Compensation'],
    keywords: ['land', 'pokkuvaravu', 'mutation', 'tahsildar', 'village office', 'survey', 'pattayam', 'deed', 'property', 'tax receipt', 'fair value', 'revenue', 'encroachment']
  },
  CIVIL_SUPPLIES: {
    name: 'Food & Civil Supplies Department',
    categories: ['Ration Cards & PDS', 'Supplyco Outlets', 'Food Adulteration', 'Price Control & Black Marketing', 'LPG Subsidy'],
    keywords: ['ration', 'supplyco', 'rice', 'wheat', 'pds', 'quota', 'dealer', 'adulteration', 'black marketing', 'civil supplies', 'food grain', 'dealer']
  },
  EDUCATION: {
    name: 'General & Higher Education Department',
    categories: ['School Infrastructure', 'Mid-Day Meals', 'Teacher Appointments', 'University & Exam Issues', 'Scholarships'],
    keywords: ['school', 'teacher', 'student', 'college', 'university', 'exam', 'class', 'mid-day meal', 'education', 'textbook', 'syllabus', 'classroom']
  },
  POLICE: {
    name: 'Kerala Police & Public Safety',
    categories: ['Law & Order', 'Traffic Safety', 'Cyber Crime & Online Fraud', 'Public Nuisance', 'Vigilance & Corruption'],
    keywords: ['police', 'crime', 'theft', 'harassment', 'fraud', 'cyber', 'traffic', 'accident', 'bribe', 'vigilance', 'safety', 'station', 'fir', 'nuisance']
  }
};

/**
 * Intelligent NLP & Contextual analysis fallback
 */
function contextualNLPAnalysis(text, district = '') {
  const lower = text.toLowerCase();
  
  // 1. Scoring departments based on taxonomy
  let bestDeptCode = 'LSGD';
  let bestDeptScore = 0;
  let suggestedCategory = 'Civic Amenities';

  for (const [code, info] of Object.entries(DEPARTMENT_TAXONOMY)) {
    let score = 0;
    for (const kw of info.keywords) {
      if (lower.includes(kw)) {
        score += kw.length > 5 ? 2.5 : 1.5;
      }
    }
    if (score > bestDeptScore) {
      bestDeptScore = score;
      bestDeptCode = code;
      // pick closest category
      suggestedCategory = info.categories[0];
      for (const cat of info.categories) {
        const catWords = cat.toLowerCase().split(/\s+/);
        if (catWords.some(w => lower.includes(w) && w.length > 3)) {
          suggestedCategory = cat;
          break;
        }
      }
    }
  }

  // 2. Priority calculation
  let priority = 'Medium';
  const urgentTriggers = ['urgent', 'emergency', 'danger', 'hazard', 'life', 'accident', 'electrocution', 'death', 'collapsed', 'rupture', 'burst', 'poison', 'dying', 'acute', 'critical'];
  const highTriggers = ['severe', 'heavy', 'serious', 'months', 'weeks', 'hundreds', 'hospital', 'child', 'elderly', 'flood', 'overflow', 'starvation', 'no water for'];
  const lowTriggers = ['request', 'suggestion', 'routine', 'minor', 'query', 'inquiry', 'proposal'];

  if (urgentTriggers.some(w => lower.includes(w))) {
    priority = 'Urgent';
  } else if (highTriggers.some(w => lower.includes(w))) {
    priority = 'High';
  } else if (lowTriggers.some(w => lower.includes(w))) {
    priority = 'Low';
  }

  // 3. Executive summary generation (NLP sentence extraction and condensation)
  const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 10);
  let summary = '';
  if (sentences.length > 0) {
    summary = sentences[0].trim();
    if (sentences.length > 1 && summary.length < 120) {
      summary += ' ' + sentences[1].trim();
    }
  } else {
    summary = text.substring(0, 150) + '...';
  }
  if (summary.length > 200) {
    summary = summary.substring(0, 197) + '...';
  }

  return {
    suggestedDepartment: DEPARTMENT_TAXONOMY[bestDeptCode]?.name || 'Local Self Government Department (LSGD)',
    suggestedDepartmentCode: bestDeptCode,
    suggestedCategory,
    suggestedPriority: priority,
    summary: `[Grievance Summary]: ${summary}`,
    isFallback: true,
    engine: 'KeralaGov Contextual NLP Classifier v2.4 (On-premise Heuristic Engine)'
  };
}

/**
 * Duplicate detector against existing grievances
 */
function detectDuplicateGrievance(subject, description, district) {
  try {
    const existing = query(`
      SELECT id, reference_no, district, subject, description, status, created_at 
      FROM grievances 
      ORDER BY id DESC LIMIT 100
    `);

    if (!existing || existing.length === 0) {
      return { isDuplicate: false };
    }

    const currentTokens = new Set(
      `${subject} ${description}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3)
    );

    let maxSimilarity = 0;
    let matchedGrievance = null;

    for (const g of existing) {
      const gTokens = new Set(
        `${g.subject} ${g.description}`
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length > 3)
      );

      // Jaccard similarity
      let intersection = 0;
      for (const t of currentTokens) {
        if (gTokens.has(t)) intersection++;
      }
      const union = new Set([...currentTokens, ...gTokens]).size;
      const sim = union > 0 ? intersection / union : 0;

      // Extra weight if district matches
      const adjustedSim = (district && g.district.toLowerCase() === district.toLowerCase()) ? sim * 1.25 : sim;

      if (adjustedSim > maxSimilarity) {
        maxSimilarity = adjustedSim;
        matchedGrievance = g;
      }
    }

    if (maxSimilarity >= 0.40 && matchedGrievance) {
      return {
        isDuplicate: true,
        similarityScore: Math.round(maxSimilarity * 100),
        matchedRef: matchedGrievance.reference_no,
        matchedSubject: matchedGrievance.subject,
        matchedStatus: matchedGrievance.status,
        warning: `Potential duplicate complaint detected! High semantic overlap (${Math.round(maxSimilarity * 100)}%) with ongoing petition ${matchedGrievance.reference_no}: "${matchedGrievance.subject}". Human review recommended.`
      };
    }

    return { isDuplicate: false, similarityScore: Math.round(maxSimilarity * 100) };
  } catch (err) {
    console.error('Error detecting duplicates:', err);
    return { isDuplicate: false };
  }
}

/**
 * Main AI Grievance Assistant Entry Point
 */
async function analyzeGrievanceText(subject, description, district = '') {
  const combinedText = `Subject: ${subject}\nDescription: ${description}\nDistrict: ${district}`;
  const apiKey = process.env.GEMINI_API_KEY;

  // Check duplicate first
  const duplicateCheck = detectDuplicateGrievance(subject, description, district);

  // If Gemini API Key is available, attempt real LLM call
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const prompt = `You are the AI Grievance Classification Assistant for the Chief Minister's Office (CMO) Government of Kerala.
Analyze the following public grievance petition submitted by a citizen:

---
${combinedText}
---

Available Kerala Government Departments:
1. Public Works Department (PWD) - roads, bridges, potholes, public buildings
2. Health & Family Welfare Department - hospitals, medicines, doctors, epidemics
3. Local Self Government Department (LSGD) - garbage, sewage, streetlights, panchayat, municipality
4. Kerala State Electricity Board (KSEB) - electricity, poles, transformers, power outages
5. Kerala Water Authority (KWA) - drinking water, pipeline leaks, water contamination
6. Revenue & Land Records Department - land survey, pokkuvaravu, mutation, pattayam
7. Food & Civil Supplies Department - ration cards, supplyco, PDS, black marketing
8. General & Higher Education Department - schools, teachers, midday meals, exams
9. Kerala Police & Public Safety - law and order, traffic, crime, vigilance petitions

Respond strictly with valid JSON only in this format:
{
  "suggestedDepartment": "Full Department Name",
  "suggestedDepartmentCode": "PWD | HEALTH | LSGD | KSEB | KWA | REVENUE | CIVIL_SUPPLIES | EDUCATION | POLICE",
  "suggestedCategory": "Specific Category Name",
  "suggestedPriority": "Low | Medium | High | Urgent",
  "summary": "Concise 1-2 sentence executive summary for the Chief Minister's Office."
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return {
            ...parsed,
            duplicateCheck,
            isFallback: false,
            engine: 'Google Gemini 1.5 Flash (CMO Kerala AI Assistant)'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, gracefully falling back to contextual NLP engine:', err.message);
    }
  }

  // Graceful, documented fallback engine
  const fallbackResult = contextualNLPAnalysis(combinedText, district);
  return {
    ...fallbackResult,
    duplicateCheck
  };
}

module.exports = {
  analyzeGrievanceText,
  detectDuplicateGrievance,
  DEPARTMENT_TAXONOMY
};
