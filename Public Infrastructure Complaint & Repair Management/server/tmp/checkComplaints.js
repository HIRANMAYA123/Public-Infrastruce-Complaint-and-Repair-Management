const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/civicfix', {} )
  .then(async () => {
    const db = mongoose.connection;
    const count = await db.db.collection('complaints').countDocuments();
    console.log('Complaints count:', count);
    const sample = await db.db.collection('complaints').findOne();
    console.log('Sample complaint:', sample);
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
