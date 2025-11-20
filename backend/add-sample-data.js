const { query } = require('./config/database');

const sampleReviews = [
  {
    doctor_id: 1,
    user_id: null,
    rating: 5,
    comment: "Dr. Smith was incredibly thorough and caring. The appointment was on time and the staff was very professional. I felt heard and understood throughout the entire visit.",
    status: "approved"
  },
  {
    doctor_id: 1,
    user_id: null,
    rating: 4,
    comment: "Great experience overall. The doctor explained everything clearly and took time to answer all my questions. Only minor wait time issue, but the quality of care was excellent.",
    status: "approved"
  },
  {
    doctor_id: 1,
    user_id: null,
    rating: 5,
    comment: "Outstanding service! The doctor was very knowledgeable and provided excellent treatment. The clinic environment was clean and comfortable. Highly recommend!",
    status: "approved"
  },
  {
    doctor_id: 1,
    user_id: null,
    rating: 3,
    comment: "The treatment was okay, but there was a long wait time. The doctor was competent but seemed rushed during the consultation.",
    status: "pending"
  },
  {
    doctor_id: 1,
    user_id: null,
    rating: 5,
    comment: "Exceptional care and attention to detail. The doctor took the time to explain my condition and treatment options thoroughly. Very satisfied with the service.",
    status: "approved"
  },
  {
    doctor_id: 1,
    user_id: null,
    rating: 2,
    comment: "The appointment was delayed significantly and the service felt impersonal. Expected better communication from the medical team.",
    status: "pending"
  }
];

async function addSampleData() {
  try {
    console.log('Adding sample review data...');
    
    // Clear existing reviews and add fresh sample data
    await query('DELETE FROM reviews');
    console.log('Cleared existing reviews');

    // Insert sample reviews
    for (const review of sampleReviews) {
      await query(
        'INSERT INTO reviews (doctor_id, user_id, rating, comment, status) VALUES (?, ?, ?, ?, ?)',
        [review.doctor_id, review.user_id, review.rating, review.comment, review.status]
      );
    }

    console.log(`✅ Added ${sampleReviews.length} sample reviews`);
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  addSampleData().then(() => {
    console.log('Sample data insertion completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Sample data insertion failed:', error);
    process.exit(1);
  });
}

module.exports = { addSampleData };