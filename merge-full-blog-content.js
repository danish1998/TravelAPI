require('dotenv').config();
const { connectDB } = require('./helpers/ConnectDB');
const Blogs = require('./Models/Blogs');
const fs = require('fs');
const path = require('path');

// Mapping function to match markdown titles with database blog names/slugs
function createSlugFromTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractLocationFromTitle(title) {
  // Extract location names from various title patterns
  const patterns = [
    /Solo Travel in\s+([^:]+)/i,
    /First-Time Guide to\s+([^:]+)/i,
    /Travel Guide\s+(\d{4}):\s*What to See.*?([^:]+)/i,
    /Explore\s+([^:]+)\s+Like a Local/i,
    /Affordable\s+([^:]+)\s+Trip/i,
    /Budget Trip to\s+([^:]+)/i,
    /Luxury Trip to\s+([^:]+)/i,
    /Ultimate\s+([^:]+)\s+Guide/i,
    /([^:]+)\s+in\s+3\s+Days/i,
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      // Get the last capture group (location)
      const location = match[match.length - 1] || match[1];
      if (location) {
        return location.trim();
      }
    }
  }
  
  // Fallback: try to extract any capitalized words
  const words = title.split(/\s+/).filter(w => /^[A-Z]/.test(w));
  if (words.length > 0) {
    return words.slice(0, 3).join(' ').replace(/[^a-zA-Z\s&,]/g, '').trim();
  }
  
  return null;
}

function normalizeLocationName(location) {
  if (!location) return null;
  // Remove common suffixes and normalize
  return location
    .replace(/\s+Travel\s+Guide.*$/i, '')
    .replace(/\s+Trip.*$/i, '')
    .replace(/\s+Guide.*$/i, '')
    .trim();
}

// Parse markdown file into blog articles
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const articles = [];
  
  // Split by --- separator
  const sections = content.split(/\n---\n/);
  
  for (const section of sections) {
    const lines = section.trim().split('\n');
    if (lines.length === 0) continue;
    
    // First line should be the title (starts with #)
    const titleLine = lines[0];
    if (!titleLine.startsWith('# ')) continue;
    
    const title = titleLine.replace(/^#\s+/, '').trim();
    const content = lines.slice(1).join('\n').trim();
    
    if (title && content) {
      articles.push({
        title,
        content,
        location: extractLocationFromTitle(title),
        slug: createSlugFromTitle(title)
      });
    }
  }
  
  return articles;
}

// Match markdown articles with database blogs - returns match score (higher = better)
function matchArticleToBlog(article, blog) {
  const articleLocation = normalizeLocationName(article.location);
  const blogName = blog.name.toLowerCase();
  const blogSlug = blog.slug.toLowerCase();
  const articleSlug = article.slug.toLowerCase();
  const articleTitle = article.title.toLowerCase();
  
  let score = 0;
  
  // Extract main location from blog name (before comma)
  const blogMainLocation = blogName.split(',')[0].trim();
  
  // HIGHEST PRIORITY: Exact location name in article title (score: 100)
  if (articleLocation) {
    const normalizedLocation = articleLocation.toLowerCase();
    if (articleTitle.includes(normalizedLocation) && (normalizedLocation.includes(blogMainLocation) || blogMainLocation.includes(normalizedLocation))) {
      score = 100;
    }
  }
  
  // HIGH PRIORITY: Blog name appears directly in article title (score: 90)
  if (articleTitle.includes(blogName) || articleTitle.includes(blogMainLocation)) {
    score = Math.max(score, 90);
  }
  
  // HIGH PRIORITY: Slug match (score: 85)
  if (blogSlug === articleSlug || blogSlug.includes(articleSlug) || articleSlug.includes(blogSlug)) {
    score = Math.max(score, 85);
  }
  
  // MEDIUM PRIORITY: Location match (score: 70)
  if (articleLocation) {
    const normalizedLocation = articleLocation.toLowerCase();
    if (normalizedLocation === blogMainLocation || blogMainLocation === normalizedLocation) {
      score = Math.max(score, 70);
    } else if (normalizedLocation.includes(blogMainLocation) || blogMainLocation.includes(normalizedLocation)) {
      score = Math.max(score, 60);
    }
  }
  
  // LOW PRIORITY: Partial matches (score: 30-50)
  if (articleLocation) {
    const normalizedLocation = articleLocation.toLowerCase();
    const blogParts = blogName.split(/[,\s&]+/).filter(p => p.length > 2);
    const locationParts = normalizedLocation.split(/[,\s&]+/).filter(p => p.length > 2);
    const matchingParts = blogParts.filter(part => 
      locationParts.some(locPart => locPart.includes(part) || part.includes(locPart))
    );
    if (matchingParts.length > 0) {
      const matchRatio = matchingParts.length / Math.max(blogParts.length, locationParts.length);
      if (matchRatio >= 0.5) {
        score = Math.max(score, 50);
      } else if (matchRatio >= 0.3) {
        score = Math.max(score, 30);
      }
    }
  }
  
  return score >= 50; // Only return true for medium+ confidence matches
}

async function mergeFullBlogContent() {
  try {
    console.log('🔄 Starting full blog content merge...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Read markdown file
    const markdownPath = '/Users/mohddanish/Downloads/5000_word_full_blogs.md';
    if (!fs.existsSync(markdownPath)) {
      throw new Error(`Markdown file not found at: ${markdownPath}`);
    }
    
    console.log(`📖 Parsing markdown file: ${markdownPath}`);
    const articles = parseMarkdownFile(markdownPath);
    console.log(`✅ Parsed ${articles.length} articles from markdown file`);
    
    // Fetch all blogs from database
    console.log('📖 Fetching blogs from database...');
    const blogCollections = await Blogs.find({}).lean();
    console.log(`✅ Found ${blogCollections.length} blog categories`);
    
    let totalMatched = 0;
    let totalUpdated = 0;
    const unmatchedArticles = [];
    const unmatchedBlogs = [];
    const usedArticles = new Set(); // Track which articles have been used
    
    // Process each blog collection
    for (const collection of blogCollections) {
      console.log(`\n📂 Processing category: ${collection.name}`);
      
      for (const blog of collection.blogs || []) {
        // Try to find matching article - find the best match
        let matchedArticle = null;
        let bestScore = 0;
        
        for (const article of articles) {
          // Skip if article already used
          if (usedArticles.has(article.title)) continue;
          // Calculate match score
          const articleLocation = normalizeLocationName(article.location);
          const blogName = blog.name.toLowerCase();
          const blogSlug = blog.slug.toLowerCase();
          const articleSlug = article.slug.toLowerCase();
          const articleTitle = article.title.toLowerCase();
          const blogMainLocation = blogName.split(',')[0].trim();
          
          let score = 0;
          
          // Exact location in title
          if (articleLocation) {
            const normalizedLocation = articleLocation.toLowerCase();
            if (articleTitle.includes(normalizedLocation) && (normalizedLocation.includes(blogMainLocation) || blogMainLocation.includes(normalizedLocation))) {
              score = 100;
            }
          }
          
          // Blog name in title
          if (articleTitle.includes(blogName) || articleTitle.includes(blogMainLocation)) {
            score = Math.max(score, 90);
          }
          
          // Slug match
          if (blogSlug === articleSlug || blogSlug.includes(articleSlug) || articleSlug.includes(blogSlug)) {
            score = Math.max(score, 85);
          }
          
          // Location match
          if (articleLocation) {
            const normalizedLocation = articleLocation.toLowerCase();
            if (normalizedLocation === blogMainLocation || blogMainLocation === normalizedLocation) {
              score = Math.max(score, 70);
            } else if (normalizedLocation.includes(blogMainLocation) || blogMainLocation.includes(normalizedLocation)) {
              score = Math.max(score, 60);
            }
          }
          
          if (score > bestScore && score >= 50) {
            bestScore = score;
            matchedArticle = article;
          }
        }
        
        if (matchedArticle) {
          totalMatched++;
          usedArticles.add(matchedArticle.title); // Mark article as used
          console.log(`   ✅ Matched: "${blog.name}" <-> "${matchedArticle.title}" (score: ${bestScore})`);
          
          // Update the blog with full content
          const result = await Blogs.updateOne(
            { 
              _id: collection._id,
              'blogs.slug': blog.slug
            },
            {
              $set: {
                'blogs.$.longDescription': matchedArticle.content,
                'blogs.$.shortDescription': matchedArticle.content.substring(0, 300) + '...'
              }
            }
          );
          
          if (result.modifiedCount > 0) {
            totalUpdated++;
            console.log(`      💾 Updated with full content (${matchedArticle.content.length} chars)`);
          }
        } else {
          unmatchedBlogs.push({ category: collection.name, blog: blog.name, slug: blog.slug });
          console.log(`   ⚠️  No match found for: "${blog.name}"`);
        }
      }
    }
    
    // Report unmatched articles
    const matchedArticleTitles = new Set();
    for (const collection of blogCollections) {
      for (const blog of collection.blogs || []) {
        for (const article of articles) {
          if (matchArticleToBlog(article, blog)) {
            matchedArticleTitles.add(article.title);
          }
        }
      }
    }
    
    for (const article of articles) {
      if (!matchedArticleTitles.has(article.title)) {
        unmatchedArticles.push(article.title);
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MERGE SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total articles parsed: ${articles.length}`);
    console.log(`✅ Total blogs in database: ${blogCollections.reduce((sum, c) => sum + (c.blogs?.length || 0), 0)}`);
    console.log(`✅ Matched: ${totalMatched}`);
    console.log(`✅ Updated: ${totalUpdated}`);
    
    if (unmatchedBlogs.length > 0) {
      console.log(`\n⚠️  Unmatched Blogs (${unmatchedBlogs.length}):`);
      unmatchedBlogs.slice(0, 10).forEach(({ category, blog }) => {
        console.log(`   - ${category} > ${blog}`);
      });
      if (unmatchedBlogs.length > 10) {
        console.log(`   ... and ${unmatchedBlogs.length - 10} more`);
      }
    }
    
    if (unmatchedArticles.length > 0) {
      console.log(`\n⚠️  Unmatched Articles (${unmatchedArticles.length}):`);
      unmatchedArticles.slice(0, 10).forEach(title => {
        console.log(`   - ${title}`);
      });
      if (unmatchedArticles.length > 10) {
        console.log(`   ... and ${unmatchedArticles.length - 10} more`);
      }
    }
    
    console.log('\n✅ Blog content merge completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during blog content merge:', error);
    console.error('Error details:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the merge
mergeFullBlogContent();

