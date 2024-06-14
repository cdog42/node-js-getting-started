const { MongoClient, ObjectId } = require('mongodb');

let db;

const connectToDatabase = async () => {
  const client = new MongoClient(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(process.env.DB_NAME); // Assuming you have DB_NAME set in your environment variables
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = {
  connectToDatabase,
  getDb,
  ObjectId // Export ObjectId for use in other files
};
