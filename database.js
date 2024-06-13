// database.js some more comments here

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb,
};
