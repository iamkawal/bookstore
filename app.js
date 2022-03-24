const express = require('express');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
let redisClient;

(async () => {
	redisClient = redis.createClient({url: process.env.REDIS_URL})
	redisClient.on('error', (err) => console.log('Redis Client Error', err));
	await redisClient.connect();
	await redisClient.set('hello', 'there');
	const value = await redisClient.get('hello');
	console.log('value is : ', value);
})();

app.get('/', async (req, res) => {
	res.render('index')

});


app.get('/:id', async(req, res) => {
	const {id} = req.params;
	console.log('id is', id)
	const rawData = await redisClient.get(id);

	console.log('rawData is : ', rawData)
	return res.send(rawData)
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})