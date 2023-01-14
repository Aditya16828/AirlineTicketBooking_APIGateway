const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit')
const axios = require('axios');

const app = express();

const {PORT} = require('./config/serverConfig');

const limiter = rateLimit({
    windowMs: 2*60*1000,
    max: 7
});

app.use(morgan('combined'));
app.use(limiter);
app.use('/bookingservice', async (req, res, next) => {
    try {
        const rqstURL = `http://localhost:3002/authenticationservice/api/v1/isauthenticated`;
        const response = await axios.get(rqstURL, {
        headers: {
            'access-token': req.headers["access-token"]
        }
    });
    next();
    } catch (error) {
        if(error.name == "TokenVerificationError" || error.name == "UserNotFoundError"){
            return res.status(error.statusCode).json({
                data: {},
                success: false,
                message: error.message,
                err: error.explanation
            });
        }
        return res.status(500).json({
            data: {},
            success: false,
            message: "Something went wrong in API Gateway",
            err: error
        });
    }    
})
app.use('/bookingservice', createProxyMiddleware({target: 'http://localhost:3003', changeOrigin: true}));

app.get('/home', (req, res) => {
    return res.status(200).json({
        message: "OK"
    })
})

app.listen(PORT, async () => {
    console.log("Server started at", PORT);
});