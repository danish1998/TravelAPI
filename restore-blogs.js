require('dotenv').config();
const { connectDB } = require('./helpers/ConnectDB');
const Blogs = require('./Models/Blogs');
const fs = require('fs');
const path = require('path');

async function restoreBlogs() {
  try {
    console.log('🔄 Starting blog restoration process...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Read the seed data from JSON file
    const seedFilePath = path.join(__dirname, 'data', 'blogs-seed.json');
    console.log(`📖 Reading seed data from: ${seedFilePath}`);
    
    const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));
    console.log(`✅ Found ${seedData.length} blog categories to restore`);
    
    // Count total blogs
    const totalBlogs = seedData.reduce((sum, category) => sum + (category.blogs?.length || 0), 0);
    console.log(`📝 Total blogs to restore: ${totalBlogs}`);
    
    // Option 1: Delete all existing blogs and insert fresh (recommended for recovery)
    console.log('\n🗑️  Clearing existing blogs...');
    const deleteResult = await Blogs.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing blog categories`);
    
    // Insert the seed data
    console.log('\n💾 Inserting blog data...');
    const insertResult = await Blogs.insertMany(seedData);
    console.log(`✅ Successfully inserted ${insertResult.length} blog categories`);
    
    // Verify the restoration
    const count = await Blogs.countDocuments();
    const allBlogs = await Blogs.find({});
    const totalRestoredBlogs = allBlogs.reduce((sum, category) => sum + (category.blogs?.length || 0), 0);
    
    console.log('\n📊 Restoration Summary:');
    console.log(`   - Categories restored: ${count}`);
    console.log(`   - Total blogs restored: ${totalRestoredBlogs}`);
    console.log('\n✅ Blog restoration completed successfully!');
    
    // List restored categories
    console.log('\n📋 Restored Categories:');
    allBlogs.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name} (${category.blogs?.length || 0} blogs)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during blog restoration:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the restoration
restoreBlogs();

