const axios = require('axios');

const authenticateUser = async (req, res, next) => {
    try {
        const rqstURL = `http://localhost:3002/authenticationservice/api/v1/isauthenticated`;
        const response = await axios.get(rqstURL, {
        headers: {
            'access-token': req.headers["access-token"]
        }
    });
    next();
    } catch (error) {
        if(error.response.data.data == "TokenVerificationError" || error.response.data.data == "UserNotFoundError"){
            return res.status(error.response.status).json({
                data: {},
                success: false,
                message: error.response.data.message,
                err: error.response.data.explanation
            });
        }
        // console.log(error.response.data);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Something went wrong in API Gateway",
            err: error
        });
    }    
}

module.exports = {authenticateUser};