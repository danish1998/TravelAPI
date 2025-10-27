#!/usr/bin/env node

const mongoose = require('mongoose');

// Database cleanup script for OAuth issues
async function cleanupDatabase() {
    console.log('🧹 Database Cleanup Script');
    console.log('==========================');
    
    try {
        // Connect to database
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mohddanish1998:D%40nish1998@project001.bbnem5h.mongodb.net/travel?retryWrites=true&w=majority';
        
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database');
        
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        
        // Check for duplicate googleIds
        console.log('\n🔍 Checking for duplicate Google IDs...');
        const duplicateGoogleIds = await User.aggregate([
            { $match: { googleId: { $ne: null } } },
            { $group: { _id: "$googleId", count: { $sum: 1 }, users: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);
        
        if (duplicateGoogleIds.length > 0) {
            console.log('❌ Found duplicate Google IDs:');
            duplicateGoogleIds.forEach(dup => {
                console.log(`Google ID: ${dup._id}, Count: ${dup.count}, Users: ${dup.users}`);
            });
        } else {
            console.log('✅ No duplicate Google IDs found');
        }
        
        // Check for duplicate emails
        console.log('\n🔍 Checking for duplicate emails...');
        const duplicateEmails = await User.aggregate([
            { $group: { _id: "$email", count: { $sum: 1 }, users: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);
        
        if (duplicateEmails.length > 0) {
            console.log('❌ Found duplicate emails:');
            duplicateEmails.forEach(dup => {
                console.log(`Email: ${dup._id}, Count: ${dup.count}, Users: ${dup.users}`);
            });
        } else {
            console.log('✅ No duplicate emails found');
        }
        
        // Check for users with missing googleId but have authProvider: 'google'
        console.log('\n🔍 Checking for inconsistent OAuth users...');
        const inconsistentUsers = await User.find({
            authProvider: 'google',
            googleId: { $exists: false }
        });
        
        if (inconsistentUsers.length > 0) {
            console.log('❌ Found users with authProvider: google but no googleId:');
            inconsistentUsers.forEach(user => {
                console.log(`User ID: ${user._id}, Email: ${user.email}`);
            });
        } else {
            console.log('✅ No inconsistent OAuth users found');
        }
        
        // Check total user count
        const totalUsers = await User.countDocuments();
        const googleUsers = await User.countDocuments({ authProvider: 'google' });
        const localUsers = await User.countDocuments({ authProvider: 'local' });
        
        console.log('\n📊 User Statistics:');
        console.log(`Total users: ${totalUsers}`);
        console.log(`Google OAuth users: ${googleUsers}`);
        console.log(`Local users: ${localUsers}`);
        
        console.log('\n🔧 Recommendations:');
        console.log('==================');
        
        if (duplicateGoogleIds.length > 0 || duplicateEmails.length > 0) {
            console.log('1. Remove duplicate users manually');
            console.log('2. Keep the most recent user for each duplicate');
            console.log('3. Update indexes if needed');
        }
        
        if (inconsistentUsers.length > 0) {
            console.log('1. Update inconsistent users to have proper googleId');
            console.log('2. Or change their authProvider to local');
        }
        
        console.log('\n✅ Database check completed');
        
    } catch (error) {
        console.error('❌ Database cleanup error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
}

// Run the cleanup
cleanupDatabase();
