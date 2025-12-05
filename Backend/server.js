const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/submit-survey', (req, res) => {
  const { answers } = req.body;
  console.log('Received survey answers:', answers);
  // Here you would typically save the answers to a database
  res.status(200).send({ message: 'Survey submitted successfully!' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});
