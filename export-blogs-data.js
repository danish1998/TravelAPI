require('dotenv').config();
const { connectDB } = require('./helpers/ConnectDB');
const Blogs = require('./Models/Blogs');
const fs = require('fs');
const path = require('path');

async function exportBlogsData() {
  try {
    console.log('🔄 Starting blog data export...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Fetch all blogs from database
    console.log('📖 Fetching blog data from MongoDB...');
    const blogsData = await Blogs.find({}).lean();
    
    if (!blogsData || blogsData.length === 0) {
      console.log('⚠️  No blogs found in database');
      process.exit(0);
    }
    
    console.log(`✅ Found ${blogsData.length} blog categories`);
    
    // Count total blogs
    const totalBlogs = blogsData.reduce((sum, category) => sum + (category.blogs?.length || 0), 0);
    console.log(`📝 Total blogs: ${totalBlogs}`);
    
    // Create export directory if it doesn't exist
    const exportDir = path.join(__dirname, 'data');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Export to JSON file
    const exportFilePath = path.join(exportDir, 'blogs-export.json');
    const jsonData = JSON.stringify(blogsData, null, 2);
    fs.writeFileSync(exportFilePath, jsonData, 'utf8');
    
    console.log(`\n✅ Blog data exported successfully!`);
    console.log(`📁 File location: ${exportFilePath}`);
    console.log(`📊 Export Summary:`);
    console.log(`   - Categories: ${blogsData.length}`);
    console.log(`   - Total blogs: ${totalBlogs}`);
    console.log(`   - File size: ${(jsonData.length / 1024).toFixed(2)} KB`);
    
    // List exported categories
    console.log(`\n📋 Exported Categories:`);
    blogsData.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name} (${category.blogs?.length || 0} blogs)`);
    });
    
    // Also create a readable summary file
    const summaryFilePath = path.join(exportDir, 'blogs-export-summary.txt');
    let summary = `Blog Data Export Summary\n`;
    summary += `========================\n\n`;
    summary += `Export Date: ${new Date().toISOString()}\n`;
    summary += `Total Categories: ${blogsData.length}\n`;
    summary += `Total Blogs: ${totalBlogs}\n\n`;
    summary += `Categories:\n`;
    summary += `-----------\n`;
    blogsData.forEach((category, index) => {
      summary += `\n${index + 1}. ${category.name} (slug: ${category.slug})\n`;
      summary += `   Description: ${category.description || 'N/A'}\n`;
      summary += `   Blogs: ${category.blogs?.length || 0}\n`;
      if (category.blogs && category.blogs.length > 0) {
        summary += `   Blog Titles:\n`;
        category.blogs.forEach((blog, blogIndex) => {
          summary += `      ${blogIndex + 1}. ${blog.name} (${blog.slug})\n`;
        });
      }
    });
    
    fs.writeFileSync(summaryFilePath, summary, 'utf8');
    console.log(`\n📄 Summary file created: ${summaryFilePath}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during blog data export:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the export
exportBlogsData();

