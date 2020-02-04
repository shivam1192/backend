const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = function checkToken(userId , accessToken) {
    console.log(config.secret);
    if(accessToken) {

        try {
            const decoded = jwt.verify(accessToken, config.secret);

            console.log(accessToken + "   " + userId );
            
            return (decoded._id === userId);
        } catch(err) {
            return false;
        }
    } else {
        return false;
    }
}

module.exports = function authorize(req , res , next){ 

    const userId = req.body._id;
    const accessToken = req.header('x-access-token');
    if(accessToken) {

        try {
            const decoded = jwt.verify(accessToken, config.secret);

            console.log(accessToken + "   " + userId );
            
            if(decoded._id === userId)
            {
                next();
            }
            else
            {
                res.send('Invalid Token');
            }
        } catch(err) {
            res.send('Invalid Token');
        }
    } else {
        return false;
    }
}
