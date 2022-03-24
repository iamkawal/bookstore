const { v4: uuidv4 } = require('uuid');
const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser')

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

let redisClient;
(async () => {
	redisClient = redis.createClient({url: process.env.REDIS_URL})
	redisClient.on('error', (err) => console.log('Redis Client Error', err));
	await redisClient.connect();
})();

app.get('/admin', async(req, res) => {
	let orders = []
	for await (const orderWithScore of redisClient.zScanIterator('orders')) {
		// order = JSON.parse(orderWithScore)
		orders.push(JSON.parse(orderWithScore.value))
	}

	return res.render('orders', {orders : orders});
})

app.post('/success', async(req, res) => {
	const timestamp = new Date()
	let order  = {timestamp: timestamp.getTime(), bookName: req.body.bookName}
	await redisClient.zAdd('orders', [{score: timestamp.getTime(),  value: JSON.stringify(order) }])
	return res.render('order-success')
});

app.get('/', async (req, res) => {
	res.render('index')

});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})