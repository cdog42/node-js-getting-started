const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const { connectToDatabase, getDb } = require('./database'); // Add this line

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .get('/', (req, res) => res.render('pages/index'))
   .get('/cool', (req, res) => res.send(cool()))
   .get('/times', (req, res) => res.send(showTimes()))
   .get('/data', async (req, res) => { // Add this route to test MongoDB
     try {
       const db = getDb();
       const collection = db.collection('test');
       const data = await collection.find({}).toArray();
       res.json(data);
     } catch (err) {
       res.status(500).send('Error fetching data from MongoDB');
     }
   })
   .listen(PORT, () => console.log(`Listening on ${PORT}`));

function showTimes() {
  const times = process.env.TIMES || 5;
  let result = '';
  for (let i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}

// Connect to MongoDB before starting the server
connectToDatabase().catch(err => console.error(err));
