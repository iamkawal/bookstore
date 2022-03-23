const express = require('express');
const redis = require('redis');

const app = express();

// (async () => {
//     const cache = createClient();
//     cache.on('error', (err) => console.log('Redis client couldn\'t start: ', err))
    
//     await cache.connect();
// })()

const PORT = process.env.PORT || 3000


app.get('/', async (req, res) => {
    return res.send('<p>Hello there</p>')
})


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})