const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit')
const {authenticateUser} = require('./middlewares/authenticateUser');

const app = express();

const {PORT} = require('./config/serverConfig');
// const PORT = 3005;

const limiter = rateLimit({
    windowMs: 2*60*1000,
    max: 7
});

app.use(morgan('combined'));
app.use(limiter);

app.use('/authenticationservice', createProxyMiddleware({target: 'http://localhost:3002', changeOrigin: true}));
app.use('/bookingservice', authenticateUser, createProxyMiddleware({target: 'http://localhost:3003', changeOrigin: true}));

app.get('/home', (req, res) => {
    return res.status(200).json({
        message: "OK"
    })
});

app.listen(PORT, async () => {
    console.log("Server started at", PORT);
});