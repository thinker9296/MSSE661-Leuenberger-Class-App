const express = require('express');
const app = express();

const port = process.env.PORT || 4000;

app.use(express.static('public'));

// commented out for performance. Already referenced from above line for 'publi'
// app.use('/css', express.static(__dirname + '/public/css')); // http://localhost:3000/css
//app.use('/js', express.static(__dirname + '/public/src')); // http://localhost:3000/js

app.listen(port, () => {
  console.log('Server started at http://localhost:%s', port);
});
