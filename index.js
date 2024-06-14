require('dotenv').config();
const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const { connectToDatabase, getDb, ObjectId } = require('./database'); // Import database functions and ObjectId

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .get('/', (req, res) => res.render('pages/index'))
   .get('/cool', (req, res) => res.send(cool()))
   .get('/admin', (req, res) => res.render('pages/admin'))
   .get('/times', (req, res) => res.send(showTimes()))
   .get('/data', async (req, res) => {
     try {
       const db = getDb();
       const collection = db.collection('test');
       const data = await collection.find({}).toArray();
       res.json(data);
     } catch (err) {
       res.status(500).send('Error fetching data from MongoDB');
     }
   });

function showTimes() {
  const times = process.env.TIMES || 5;
  let result = '';
  for (let i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}

app.use(express.urlencoded({ extended: true }));

app.post('/admin/add', async (req, res) => {
  const data = req.body.data;
  try {
    const db = getDb();
    const collection = db.collection('test');
    await collection.insertOne({ data });
    res.redirect('/admin');
  } catch (err) {
    console.error('Error adding data:', err); // Log the error details
    res.status(500).send('Error adding data');
  }
});

app.post('/admin/delete', async (req, res) => {
  const id = req.body.id;
  try {
    const db = getDb();
    const collection = db.collection('test');
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.redirect('/admin');
  } catch (err) {
    console.error('Error deleting data:', err); // Log the error details
    res.status(500).send('Error deleting data');
  }
});

// Connect to MongoDB before starting the server
connectToDatabase().then(() => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}).catch(err => console.error('Failed to connect to database', err));
