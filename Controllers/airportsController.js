const Airport = require("../Models/Airport");

// Alternative spellings for city names
const getAlternativeSpellings = (searchTerm) => {
  const alternatives = [];
  const term = searchTerm.toLowerCase();
  
  // Common alternative spellings
  if (term === 'madina') {
    alternatives.push('medina');
  } else if (term === 'medina') {
    alternatives.push('madina');
  }
  
  return alternatives;
};

// State name to ISO region mapping
const getStateRegion = (searchTerm) => {
  const stateMap = {
    'pennsylvania': 'US-PA',
    'california': 'US-CA',
    'texas': 'US-TX',
    'florida': 'US-FL',
    'new york': 'US-NY',
    'illinois': 'US-IL',
    'ohio': 'US-OH',
    'michigan': 'US-MI',
    'georgia': 'US-GA',
    'north carolina': 'US-NC',
    'virginia': 'US-VA',
    'washington': 'US-WA',
    'massachusetts': 'US-MA',
    'arizona': 'US-AZ',
    'tennessee': 'US-TN',
    'indiana': 'US-IN',
    'missouri': 'US-MO',
    'maryland': 'US-MD',
    'wisconsin': 'US-WI',
    'colorado': 'US-CO',
    'minnesota': 'US-MN',
    'south carolina': 'US-SC',
    'alabama': 'US-AL',
    'louisiana': 'US-LA',
    'kentucky': 'US-KY',
    'oregon': 'US-OR',
    'oklahoma': 'US-OK',
    'connecticut': 'US-CT',
    'utah': 'US-UT',
    'iowa': 'US-IA',
    'nevada': 'US-NV',
    'arkansas': 'US-AR',
    'mississippi': 'US-MS',
    'kansas': 'US-KS',
    'new mexico': 'US-NM',
    'nebraska': 'US-NE',
    'west virginia': 'US-WV',
    'idaho': 'US-ID',
    'hawaii': 'US-HI',
    'new hampshire': 'US-NH',
    'maine': 'US-ME',
    'montana': 'US-MT',
    'rhode island': 'US-RI',
    'delaware': 'US-DE',
    'south dakota': 'US-SD',
    'north dakota': 'US-ND',
    'alaska': 'US-AK',
    'vermont': 'US-VT',
    'wyoming': 'US-WY'
  };
  
  const term = searchTerm.toLowerCase().trim();
  return stateMap[term] || null;
};

// Country name to ISO code mapping
const getCountryISO = (searchTerm) => {
  const countryMap = {
    // Middle East & Asia
    'saudi': 'SA',
    'saudi arabia': 'SA',
    'iraq': 'IQ',
    'iran': 'IR',
    'iran islamic republic': 'IR',
    'uae': 'AE',
    'united arab emirates': 'AE',
    'kuwait': 'KW',
    'qatar': 'QA',
    'bahrain': 'BH',
    'oman': 'OM',
    'yemen': 'YE',
    'jordan': 'JO',
    'lebanon': 'LB',
    'syria': 'SY',
    'israel': 'IL',
    'palestine': 'PS',
    'turkey': 'TR',
    'pakistan': 'PK',
    'afghanistan': 'AF',
    'bangladesh': 'BD',
    'sri lanka': 'LK',
    'nepal': 'NP',
    'bhutan': 'BT',
    'maldives': 'MV',
    'india': 'IN',
    'china': 'CN',
    'japan': 'JP',
    'south korea': 'KR',
    'north korea': 'KP',
    'thailand': 'TH',
    'vietnam': 'VN',
    'cambodia': 'KH',
    'laos': 'LA',
    'myanmar': 'MM',
    'malaysia': 'MY',
    'singapore': 'SG',
    'indonesia': 'ID',
    'philippines': 'PH',
    'brunei': 'BN',
    'mongolia': 'MN',
    'kazakhstan': 'KZ',
    'uzbekistan': 'UZ',
    'turkmenistan': 'TM',
    'tajikistan': 'TJ',
    'kyrgyzstan': 'KG',
    
    // Europe
    'united kingdom': 'GB',
    'uk': 'GB',
    'britain': 'GB',
    'great britain': 'GB',
    'france': 'FR',
    'germany': 'DE',
    'italy': 'IT',
    'spain': 'ES',
    'portugal': 'PT',
    'netherlands': 'NL',
    'holland': 'NL',
    'belgium': 'BE',
    'switzerland': 'CH',
    'austria': 'AT',
    'poland': 'PL',
    'czech republic': 'CZ',
    'czechia': 'CZ',
    'hungary': 'HU',
    'romania': 'RO',
    'bulgaria': 'BG',
    'greece': 'GR',
    'croatia': 'HR',
    'serbia': 'RS',
    'slovenia': 'SI',
    'slovakia': 'SK',
    'ukraine': 'UA',
    'russia': 'RU',
    'russian federation': 'RU',
    'norway': 'NO',
    'sweden': 'SE',
    'denmark': 'DK',
    'finland': 'FI',
    'iceland': 'IS',
    'ireland': 'IE',
    
    // Americas
    'united states': 'US',
    'usa': 'US',
    'america': 'US',
    'pennsylvania': 'US',
    'california': 'US',
    'texas': 'US',
    'florida': 'US',
    'new york': 'US',
    'canada': 'CA',
    'mexico': 'MX',
    'brazil': 'BR',
    'argentina': 'AR',
    'chile': 'CL',
    'colombia': 'CO',
    'peru': 'PE',
    'venezuela': 'VE',
    'ecuador': 'EC',
    'bolivia': 'BO',
    'paraguay': 'PY',
    'uruguay': 'UY',
    'guyana': 'GY',
    'suriname': 'SR',
    'cuba': 'CU',
    'jamaica': 'JM',
    'haiti': 'HT',
    'dominican republic': 'DO',
    'puerto rico': 'PR',
    'costa rica': 'CR',
    'panama': 'PA',
    'nicaragua': 'NI',
    'honduras': 'HN',
    'guatemala': 'GT',
    'belize': 'BZ',
    'el salvador': 'SV',
    
    // Africa
    'egypt': 'EG',
    'libya': 'LY',
    'tunisia': 'TN',
    'algeria': 'DZ',
    'morocco': 'MA',
    'sudan': 'SD',
    'ethiopia': 'ET',
    'kenya': 'KE',
    'uganda': 'UG',
    'tanzania': 'TZ',
    'rwanda': 'RW',
    'burundi': 'BI',
    'somalia': 'SO',
    'djibouti': 'DJ',
    'eritrea': 'ER',
    'south africa': 'ZA',
    'zimbabwe': 'ZW',
    'zambia': 'ZM',
    'botswana': 'BW',
    'namibia': 'NA',
    'angola': 'AO',
    'mozambique': 'MZ',
    'madagascar': 'MG',
    'mauritius': 'MU',
    'seychelles': 'SC',
    'nigeria': 'NG',
    'ghana': 'GH',
    'senegal': 'SN',
    'mali': 'ML',
    'burkina faso': 'BF',
    'niger': 'NE',
    'chad': 'TD',
    'cameroon': 'CM',
    'central african republic': 'CF',
    'congo': 'CG',
    'democratic republic of congo': 'CD',
    'gabon': 'GA',
    'equatorial guinea': 'GQ',
    'sao tome and principe': 'ST',
    
    // Oceania
    'australia': 'AU',
    'new zealand': 'NZ',
    'fiji': 'FJ',
    'papua new guinea': 'PG',
    'solomon islands': 'SB',
    'vanuatu': 'VU',
    'new caledonia': 'NC',
    'french polynesia': 'PF',
    'samoa': 'WS',
    'tonga': 'TO',
    'kiribati': 'KI',
    'tuvalu': 'TV',
    'nauru': 'NR',
    'palau': 'PW',
    'marshall islands': 'MH',
    'micronesia': 'FM'
  };
  
  const term = searchTerm.toLowerCase().trim();
  return countryMap[term] || null;
};

// Single search endpoint for airports
const searchAirports = async (req, res) => {
  try {
    const {
      q, // search query (name, iata, city, country)
      limit = 20,
      page = 1,
      priority_country // ISO country code to prioritize (e.g., "IN" for India)
    } = req.query;
    
    // Set default priority country to India if not specified
    const finalPriorityCountry = priority_country || 'IN';

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' parameter is required"
      });
    }

    const searchTerm = q.trim();
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get alternative spellings for the search term
    const alternatives = getAlternativeSpellings(searchTerm);
    
    // Get country ISO code if search term is a country name
    const countryISO = getCountryISO(searchTerm);
    
    // Get state ISO region code if search term is a state name
    const stateRegion = getStateRegion(searchTerm);
    
    // Build comprehensive search conditions
    const searchConditions = [];
    
    // 1. EXACT MATCHES (highest priority)
    // IATA codes (3 letters)
    if (searchTerm.length === 3) {
      searchConditions.push({ iata_code: searchTerm.toUpperCase() });
    }
    
    // ICAO codes (4 letters)
    if (searchTerm.length === 4) {
      searchConditions.push({ icao_code: searchTerm.toUpperCase() });
    }
    
    // Airport identifiers
    searchConditions.push({ ident: searchTerm.toUpperCase() });
    
    // 2. COUNTRY SEARCH
    if (countryISO) {
      searchConditions.push({ iso_country: countryISO });
    } else if (searchTerm.length <= 2) {
      searchConditions.push({ iso_country: searchTerm.toUpperCase() });
    }
    
    // 2.5. STATE/REGION SEARCH
    if (stateRegion) {
      searchConditions.push({ iso_region: stateRegion });
    }
    
    // 3. TEXT SEARCH - Simple and effective approach
    if (searchTerm.length > 2) {
      // Create a simple text search that works across all fields
      const textSearch = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { municipality: new RegExp(searchTerm, 'i') },
          { keywords: new RegExp(searchTerm, 'i') },
          { iso_region: new RegExp(searchTerm, 'i') }
        ]
      };
      searchConditions.push(textSearch);
      
      // For multi-word searches, also search for individual words
      if (searchTerm.includes(' ')) {
        const words = searchTerm.split(/\s+/).filter(word => word.length > 1);
        words.forEach(word => {
          searchConditions.push({ name: new RegExp(word, 'i') });
          searchConditions.push({ municipality: new RegExp(word, 'i') });
          searchConditions.push({ keywords: new RegExp(word, 'i') });
          searchConditions.push({ iso_region: new RegExp(word, 'i') });
        });
      }
    }
    
    // 4. ALTERNATIVE SPELLINGS
    alternatives.forEach(alt => {
      searchConditions.push({ municipality: new RegExp(alt, 'i') });
      searchConditions.push({ name: new RegExp(alt, 'i') });
    });

    // Build search query with better performance
    const searchQuery = {
      $and: [
        {
          $or: searchConditions
        },
        {
          type: { $in: ['large_airport', 'medium_airport', 'small_airport'] }
        }
      ]
    };
    
    // Debug logging
    console.log('Search term:', searchTerm);
    console.log('Search conditions count:', searchConditions.length);
    console.log('Search query:', JSON.stringify(searchQuery, null, 2));

    // Use aggregation pipeline for proper type-based sorting
    const pipeline = [
      { $match: searchQuery },
      { 
        $addFields: { 
          typePriority: { 
            $switch: {
              branches: [
                { case: { $eq: ["$type", "large_airport"] }, then: 1 },
                { case: { $eq: ["$type", "medium_airport"] }, then: 2 },
                { case: { $eq: ["$type", "small_airport"] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      }
    ];

    // Add sorting based on priority country and type
    if (finalPriorityCountry && finalPriorityCountry.trim() !== '') {
      const priorityCountry = finalPriorityCountry.trim().toUpperCase();
      pipeline.push({
        $addFields: {
          isPriorityCountry: { $eq: ["$iso_country", priorityCountry] }
        }
      });
      pipeline.push({
        $sort: { 
          isPriorityCountry: -1, // Priority country first
          typePriority: 1, // Then by airport type
          name: 1 
        }
      });
    } else {
      pipeline.push({
        $sort: { 
          typePriority: 1, // Sort by airport type priority
          name: 1 
        }
      });
    }

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });
    pipeline.push({ $project: { __v: 0, typePriority: 0, isPriorityCountry: 0 } });

    const airports = await Airport.aggregate(pipeline);

    const total = await Airport.countDocuments(searchQuery);

    res.json({
      success: true,
      data: airports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      searchTerm: searchTerm,
      priorityCountry: finalPriorityCountry.trim().toUpperCase()
    });
  } catch (error) {
    console.error("Error searching airports:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  searchAirports
};
