// Airline mapping service to get full names and logos
const airlineData = {
  'IX': {
    name: 'Air India Express',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/IX.png',
    fullName: 'Air India Express'
  },
  'QP': {
    name: 'Qatar Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/QR.png',
    fullName: 'Qatar Airways'
  },
  'AI': {
    name: 'Air India',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AI.png',
    fullName: 'Air India'
  },
  'SG': {
    name: 'SpiceJet',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/SG.png',
    fullName: 'SpiceJet'
  },
  '6E': {
    name: 'IndiGo',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/6E.png',
    fullName: 'IndiGo'
  },
  'G8': {
    name: 'GoAir',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/G8.png',
    fullName: 'GoAir'
  },
  '9W': {
    name: 'Jet Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/9W.png',
    fullName: 'Jet Airways'
  },
  'UK': {
    name: 'Vistara',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/UK.png',
    fullName: 'Vistara'
  },
  'I5': {
    name: 'AirAsia India',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/I5.png',
    fullName: 'AirAsia India'
  },
  'S2': {
    name: 'JetLite',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/S2.png',
    fullName: 'JetLite'
  },
  'H1': {
    name: 'Hahn Air Systems',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/H1.png',
    fullName: 'Hahn Air Systems'
  },
  'HR': {
    name: 'Hahn Air Lines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/HR.png',
    fullName: 'Hahn Air Lines'
  },
  'QR': {
    name: 'Qatar Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/QR.png',
    fullName: 'Qatar Airways'
  },
  'EK': {
    name: 'Emirates',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/EK.png',
    fullName: 'Emirates'
  },
  'EY': {
    name: 'Etihad Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/EY.png',
    fullName: 'Etihad Airways'
  },
  'SV': {
    name: 'Saudia',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/SV.png',
    fullName: 'Saudia'
  },
  'GF': {
    name: 'Gulf Air',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/GF.png',
    fullName: 'Gulf Air'
  },
  'MS': {
    name: 'EgyptAir',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/MS.png',
    fullName: 'EgyptAir'
  },
  'KU': {
    name: 'Kuwait Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/KU.png',
    fullName: 'Kuwait Airways'
  },
  'RJ': {
    name: 'Royal Jordanian',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/RJ.png',
    fullName: 'Royal Jordanian'
  },
  'BA': {
    name: 'British Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/BA.png',
    fullName: 'British Airways'
  },
  'LH': {
    name: 'Lufthansa',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/LH.png',
    fullName: 'Lufthansa'
  },
  'AF': {
    name: 'Air France',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AF.png',
    fullName: 'Air France'
  },
  'KL': {
    name: 'KLM Royal Dutch Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/KL.png',
    fullName: 'KLM Royal Dutch Airlines'
  },
  'LX': {
    name: 'Swiss International Air Lines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/LX.png',
    fullName: 'Swiss International Air Lines'
  },
  'OS': {
    name: 'Austrian Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/OS.png',
    fullName: 'Austrian Airlines'
  },
  'SN': {
    name: 'Brussels Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/SN.png',
    fullName: 'Brussels Airlines'
  },
  'TP': {
    name: 'TAP Air Portugal',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/TP.png',
    fullName: 'TAP Air Portugal'
  },
  'IB': {
    name: 'Iberia',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/IB.png',
    fullName: 'Iberia'
  },
  'AZ': {
    name: 'Alitalia',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AZ.png',
    fullName: 'Alitalia'
  },
  'AY': {
    name: 'Finnair',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AY.png',
    fullName: 'Finnair'
  },
  'SK': {
    name: 'SAS Scandinavian Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/SK.png',
    fullName: 'SAS Scandinavian Airlines'
  },
  'DY': {
    name: 'Norwegian Air Shuttle',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/DY.png',
    fullName: 'Norwegian Air Shuttle'
  },
  'WF': {
    name: 'Widerøe',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/WF.png',
    fullName: 'Widerøe'
  },
  'TK': {
    name: 'Turkish Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/TK.png',
    fullName: 'Turkish Airlines'
  },
  'PC': {
    name: 'Pegasus Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/PC.png',
    fullName: 'Pegasus Airlines'
  },
  'SU': {
    name: 'Aeroflot',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/SU.png',
    fullName: 'Aeroflot'
  },
  'FV': {
    name: 'Rossiya Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/FV.png',
    fullName: 'Rossiya Airlines'
  },
  'S7': {
    name: 'S7 Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/S7.png',
    fullName: 'S7 Airlines'
  },
  'U6': {
    name: 'Ural Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/U6.png',
    fullName: 'Ural Airlines'
  },
  'DP': {
    name: 'Pobeda',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/DP.png',
    fullName: 'Pobeda'
  },
  'NH': {
    name: 'ANA (All Nippon Airways)',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/NH.png',
    fullName: 'ANA (All Nippon Airways)'
  },
  'JL': {
    name: 'Japan Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/JL.png',
    fullName: 'Japan Airlines'
  },
  'KE': {
    name: 'Korean Air',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/KE.png',
    fullName: 'Korean Air'
  },
  'OZ': {
    name: 'Asiana Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/OZ.png',
    fullName: 'Asiana Airlines'
  },
  'CI': {
    name: 'China Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/CI.png',
    fullName: 'China Airlines'
  },
  'BR': {
    name: 'EVA Air',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/BR.png',
    fullName: 'EVA Air'
  },
  'CX': {
    name: 'Cathay Pacific',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/CX.png',
    fullName: 'Cathay Pacific'
  },
  'KA': {
    name: 'Cathay Dragon',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/KA.png',
    fullName: 'Cathay Dragon'
  },
  'SQ': {
    name: 'Singapore Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/SQ.png',
    fullName: 'Singapore Airlines'
  },
  'TG': {
    name: 'Thai Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/TG.png',
    fullName: 'Thai Airways'
  },
  'MH': {
    name: 'Malaysia Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/MH.png',
    fullName: 'Malaysia Airlines'
  },
  'GA': {
    name: 'Garuda Indonesia',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/GA.png',
    fullName: 'Garuda Indonesia'
  },
  'QF': {
    name: 'Qantas',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/QF.png',
    fullName: 'Qantas'
  },
  'VA': {
    name: 'Virgin Australia',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/VA.png',
    fullName: 'Virgin Australia'
  },
  'JQ': {
    name: 'Jetstar Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/JQ.png',
    fullName: 'Jetstar Airways'
  },
  'NZ': {
    name: 'Air New Zealand',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/NZ.png',
    fullName: 'Air New Zealand'
  },
  'FJ': {
    name: 'Fiji Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/FJ.png',
    fullName: 'Fiji Airways'
  },
  'AC': {
    name: 'Air Canada',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AC.png',
    fullName: 'Air Canada'
  },
  'WS': {
    name: 'WestJet',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/WS.png',
    fullName: 'WestJet'
  },
  'UA': {
    name: 'United Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/UA.png',
    fullName: 'United Airlines'
  },
  'AA': {
    name: 'American Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AA.png',
    fullName: 'American Airlines'
  },
  'DL': {
    name: 'Delta Air Lines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/DL.png',
    fullName: 'Delta Air Lines'
  },
  'WN': {
    name: 'Southwest Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/WN.png',
    fullName: 'Southwest Airlines'
  },
  'B6': {
    name: 'JetBlue Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/B6.png',
    fullName: 'JetBlue Airways'
  },
  'NK': {
    name: 'Spirit Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/NK.png',
    fullName: 'Spirit Airlines'
  },
  'F9': {
    name: 'Frontier Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/F9.png',
    fullName: 'Frontier Airlines'
  },
  'AS': {
    name: 'Alaska Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AS.png',
    fullName: 'Alaska Airlines'
  },
  'HA': {
    name: 'Hawaiian Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/HA.png',
    fullName: 'Hawaiian Airlines'
  },
  'VX': {
    name: 'Virgin America',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/VX.png',
    fullName: 'Virgin America'
  },
  'VS': {
    name: 'Virgin Atlantic',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/VS.png',
    fullName: 'Virgin Atlantic'
  },
  'EI': {
    name: 'Aer Lingus',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/EI.png',
    fullName: 'Aer Lingus'
  },
  'FR': {
    name: 'Ryanair',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/FR.png',
    fullName: 'Ryanair'
  },
  'U2': {
    name: 'easyJet',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/U2.png',
    fullName: 'easyJet'
  },
  'W6': {
    name: 'Wizz Air',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/W6.png',
    fullName: 'Wizz Air'
  },
  'VY': {
    name: 'Vueling',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/VY.png',
    fullName: 'Vueling'
  },
  'EW': {
    name: 'Eurowings',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/EW.png',
    fullName: 'Eurowings'
  },
  '4U': {
    name: 'Germanwings',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/4U.png',
    fullName: 'Germanwings'
  },
  'BE': {
    name: 'Flybe',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/BE.png',
    fullName: 'Flybe'
  },
  'T3': {
    name: 'Eastern Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/T3.png',
    fullName: 'Eastern Airways'
  },
  'LM': {
    name: 'Loganair',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/LM.png',
    fullName: 'Loganair'
  },
  'BA': {
    name: 'British Airways',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/BA.png',
    fullName: 'British Airways'
  },
  'VS': {
    name: 'Virgin Atlantic',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/VS.png',
    fullName: 'Virgin Atlantic'
  },
  'BZ': {
    name: 'Blue Air',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/BZ.png',
    fullName: 'Blue Air'
  },
  'RO': {
    name: 'TAROM',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/RO.png',
    fullName: 'TAROM'
  },
  'LO': {
    name: 'LOT Polish Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/LO.png',
    fullName: 'LOT Polish Airlines'
  },
  'OK': {
    name: 'Czech Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/OK.png',
    fullName: 'Czech Airlines'
  },
  'OS': {
    name: 'Austrian Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/OS.png',
    fullName: 'Austrian Airlines'
  },
  'LX': {
    name: 'Swiss International Air Lines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/LX.png',
    fullName: 'Swiss International Air Lines'
  },
  'SN': {
    name: 'Brussels Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/SN.png',
    fullName: 'Brussels Airlines'
  },
  'TP': {
    name: 'TAP Air Portugal',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/TP.png',
    fullName: 'TAP Air Portugal'
  },
  'IB': {
    name: 'Iberia',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/IB.png',
    fullName: 'Iberia'
  },
  'AZ': {
    name: 'Alitalia',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AZ.png',
    fullName: 'Alitalia'
  },
  'AY': {
    name: 'Finnair',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/AY.png',
    fullName: 'Finnair'
  },
  'SK': {
    name: 'SAS Scandinavian Airlines',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/SK.png',
    fullName: 'SAS Scandinavian Airlines'
  },
  'DY': {
    name: 'Norwegian Air Shuttle',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/DY.png',
    fullName: 'Norwegian Air Shuttle'
  },
  'WF': {
    name: 'Widerøe',
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/WF.png',
    fullName: 'Widerøe'
  }
};

/**
 * Get airline information by IATA code
 * @param {string} iataCode - The IATA airline code
 * @returns {object} Airline information with name, logo, and fullName
 */
const getAirlineInfo = (iataCode) => {
  if (!iataCode) {
    return {
      name: 'Unknown Airline',
      logo: 'https://logos.skyscnr.com/images/airlines/favicon/default.png',
      fullName: 'Unknown Airline'
    };
  }

  const airline = airlineData[iataCode.toUpperCase()];
  if (airline) {
    return airline;
  }

  // Return default for unknown airlines
  return {
    name: `${iataCode} Airlines`,
    logo: 'https://logos.skyscnr.com/images/airlines/favicon/default.png',
    fullName: `${iataCode} Airlines`
  };
};

/**
 * Get all available airlines
 * @returns {object} All airline data
 */
const getAllAirlines = () => {
  return airlineData;
};

/**
 * Search airlines by name
 * @param {string} searchTerm - Search term for airline name
 * @returns {array} Array of matching airlines
 */
const searchAirlines = (searchTerm) => {
  if (!searchTerm) return [];
  
  const searchLower = searchTerm.toLowerCase();
  return Object.entries(airlineData)
    .filter(([code, airline]) => 
      airline.name.toLowerCase().includes(searchLower) ||
      airline.fullName.toLowerCase().includes(searchLower) ||
      code.toLowerCase().includes(searchLower)
    )
    .map(([code, airline]) => ({
      code,
      ...airline
    }));
};

module.exports = {
  getAirlineInfo,
  getAllAirlines,
  searchAirlines
};
