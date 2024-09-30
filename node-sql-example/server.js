const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const route = require('./route');

app.use(bodyParser.json());
app.use('/api', route); // Mount the route handlers under '/api'

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
