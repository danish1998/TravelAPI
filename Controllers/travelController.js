const axios = require("axios");
const cheerio = require("cheerio");

const searchTravelPlace = async (req, res) => {
  try {
    const searchTerm = req.params.place;
    if (!searchTerm) return res.status(400).json({ error: "Place required" });

    // Step 1: Search for the correct page title
    const searchUrl = `https://en.wikivoyage.org/w/api.php`;
    const searchResponse = await axios.get(searchUrl, {
      params: {
        action: 'opensearch',
        search: searchTerm,
        limit: 1,
        namespace: 0, // Main namespace only (articles)
        format: 'json',
        origin: '*'
      },
      headers: {
        'User-Agent': 'TravelApp/1.0 (Educational Project; contact@example.com)',
      },
      timeout: 5000
    });

    const pageTitle = searchResponse.data[1]?.[0];
    if (!pageTitle) {
      return res.status(404).json({ 
        error: "Place not found",
        suggestion: "Try searching for a different location" 
      });
    }

    // Step 2: Fetch the page content using the correct title
    const url = `https://en.wikivoyage.org/w/api.php`;
    const response = await axios.get(url, {
      params: {
        action: 'parse',
        page: pageTitle,
        prop: 'text',
        format: 'json',
        origin: '*'
      },
      headers: {
        'User-Agent': 'TravelApp/1.0 (Educational Project; contact@example.com)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 10000
    });

    if (!response.data.parse) {
      return res.status(404).json({ error: "Place not found" });
    }

    const html = response.data.parse.text["*"];
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, .mw-editsection, .reference, sup, .thumbcaption').remove();

    // 📝 Intro - get first few meaningful paragraphs
    let intro = "";
    const introParas = [];
    $(".mw-parser-output > p").each((i, el) => {
      const text = $(el).text().trim().replace(/\[\d+\]/g, "").replace(/\s+/g, " ");
      if (text.length > 100 && introParas.length < 2) {
        introParas.push(text);
      }
      if (introParas.length === 2) return false;
    });
    intro = introParas.join(" ");

    // Helper to clean text
    const cleanText = (text) => {
      return text
        .replace(/\[\d+\]/g, "")
        .replace(/\s+/g, " ")
        .replace(/\n+/g, " ")
        .trim();
    };

    // 🔎 Get section text content by heading ID
    const getSectionText = (sectionId) => {
      const heading = $(`#${sectionId}`).parent();
      if (!heading.length) return "";
      
      let content = [];
      let next = heading.next();
      
      while (next.length && !next.is("h2")) {
        if (next.is("p")) {
          const text = cleanText(next.text());
          if (text && text.length > 50) {
            content.push(text);
          }
        }
        next = next.next();
      }
      
      return content.join(" ");
    };

    // 📋 Extract clean list items from section
    const getCleanList = (sectionId, maxItems = 10) => {
      const heading = $(`#${sectionId}`).parent();
      if (!heading.length) return [];
      
      const items = [];
      let next = heading.next();
      
      while (next.length && !next.is("h2") && items.length < maxItems) {
        if (next.is("ul") || next.is("ol")) {
          next.find("> li").each((i, li) => {
            if (items.length >= maxItems) return false;
            
            // Get only the direct text content, not nested lists
            const $li = $(li);
            $li.find("ul, ol").remove(); // Remove nested lists
            
            let text = $li.text();
            text = cleanText(text);
            
            // Split by em dash or hyphen to get clean name
            const parts = text.split(/[—–-]/);
            if (parts.length > 0) {
              text = parts[0].trim();
            }
            
            // Filter out very short or numbered items
            if (text && text.length > 3 && text.length < 100 && !/^\d+$/.test(text)) {
              items.push(text);
            }
          });
        }
        next = next.next();
      }
      
      return items;
    };

    // Extract specific sections
    const regions = getSectionText("Regions") || getSectionText("Region");
    const cities = getCleanList("Cities", 8);
    const attractions = getCleanList("See", 15);
    
    // Get beaches - either from dedicated section or extract from attractions
    let beaches = [];
    
    // Try to find beaches in a dedicated section
    const beachHeading = $("#Beaches").parent();
    if (beachHeading.length) {
      let next = beachHeading.next();
      while (next.length && !next.is("h2") && !next.is("h3")) {
        if (next.is("ul")) {
          next.find("> li").each((i, li) => {
            const text = $(li).text().split(/[—–-]/)[0].trim();
            const cleaned = cleanText(text);
            if (cleaned && cleaned.length < 50 && beaches.length < 15) {
              beaches.push(cleaned);
            }
          });
        }
        next = next.next();
      }
    }
    
    // Fallback: extract beach names from text
    if (beaches.length === 0) {
      const beachRegex = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+beach/g;
      const seeText = getSectionText("See");
      let match;
      while ((match = beachRegex.exec(seeText)) !== null && beaches.length < 15) {
        const beachName = match[1].trim();
        if (!beaches.includes(beachName)) {
          beaches.push(beachName);
        }
      }
    }

    // Things to do
    const thingsToDo = getCleanList("Do", 12);

    // Food section
    const eatSection = getSectionText("Eat");
    const food = eatSection.slice(0, 500);

    // Transport
    const getInSection = getSectionText("Get_in") || getSectionText("Get_around");
    const transport = getInSection.slice(0, 500);

    // Best time to visit
    const understandSection = getSectionText("Understand");
    let bestTimeToVisit = "";
    const bestTimeMatch = understandSection.match(/best time[^.]*\./i);
    if (bestTimeMatch) {
      bestTimeToVisit = bestTimeMatch[0].trim();
    }

    // 🖼️ Fetch images from Unsplash
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;
    let images = [];
    
    if (unsplashApiKey) {
      try {
        const unsplashUrl = `https://api.unsplash.com/search/photos`;
        const unsplashResponse = await axios.get(unsplashUrl, {
          params: {
            query: pageTitle, // Use the correct page title for better image results
            per_page: 10,
            orientation: 'landscape'
          },
          headers: {
            'Authorization': `Client-ID ${unsplashApiKey}`,
            'Accept-Version': 'v1'
          },
          timeout: 5000
        });

        if (unsplashResponse.data && unsplashResponse.data.results) {
          images = unsplashResponse.data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            thumb: photo.urls.thumb,
            full: photo.urls.full,
            description: photo.description || photo.alt_description || `${pageTitle} image`,
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html,
            downloadLink: photo.links.download_location
          }));
        }
      } catch (unsplashError) {
        console.error("Unsplash API error:", unsplashError.message);
        // Don't fail the whole request if images fail
        images = [];
      }
    }

    const data = { 
      place: pageTitle, // Use the actual page title from Wikivoyage
      intro: intro || "No introduction available",
      regions: regions || "Information not available",
      cities: cities.length > 0 ? cities : ["No cities listed"],
      beaches: beaches.length > 0 ? beaches : ["No beaches listed"],
      attractions: attractions.length > 0 ? attractions : ["No attractions listed"],
      thingsToDo: thingsToDo.length > 0 ? thingsToDo : ["No activities listed"],
      food: food || "No food information available",
      transport: transport || "No transport information available",
      bestTimeToVisit: bestTimeToVisit || "Information not available",
      images: images,
      source: "Wikivoyage",
    }

    res.json({ data });
  } catch (err) {
    console.error("Travel API error:", err.message);
    
    if (err.response) {
      return res.status(err.response.status).json({ 
        error: "Failed to fetch travel data",
        details: err.response.statusText 
      });
    } else if (err.request) {
      return res.status(503).json({ 
        error: "No response from Wikivoyage",
        details: "Service unavailable" 
      });
    } else {
      return res.status(500).json({ 
        error: "Failed to fetch travel data",
        details: err.message 
      });
    }
  }
};

module.exports = { searchTravelPlace };