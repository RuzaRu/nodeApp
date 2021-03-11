const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const db = require("../model");

const authJWT  = (req, res, next) => {
    
    var authHeader = req.headers.authorization;

    if(authHeader){

        const token = authHeader.split(' ')[1];

        if(!token) {
         return   res.status(401).send({auth: false, message: "There is no token"});
        }
        else {
            jwt.verify(token, authConfig.secret, (err, decoded) => {
                if (err) {
                    return res.status(500).send({auth: false, message: "Failed to authenticate token"});
                }
                var userId = decoded.id;
               
                db.user.findById(userId)
                .then(data => {
                    next();
                })
                .catch(err => {
                    res.status(500).send({message: "Could not find the user"});
                });
        
            } );
        
        }
    }
    else {
        return res.sendStatus(403);
       
    }

    };

    module.exports = authJWT;
