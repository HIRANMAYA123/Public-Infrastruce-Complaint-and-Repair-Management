const mongoose = require('mongoose');
(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/civicfix', {});
    const db = mongoose.connection;
    const count = await db.db.collection('complaints').countDocuments();
    console.log('Complaints count:', count);
    const sample = await db.db.collection('complaints').findOne();
    console.log('Sample complaint:', sample);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
})();
