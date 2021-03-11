const user = require("../controllers/user.controller");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");

function addRoutes(app) {
    
    //Login
    app.post("/login", (req,res)=> {
        if (!req.body.email && !req.body.password) {
            res.status(400).send({message: "There is no user email or password"});
            return;
        }

        user.checkUserEmail(req.body.email)
        .then(data=> {
            if (data.length==0) {
                res.status(401).send({auth: false, message: "User does not exist"});
            }
            else {
                if(data[0].password != req.body.password){
                    res.status(401).send({auth: false, message: "User does not exist"});
                }
                var token= jwt.sign({id: data[0].id}, authConfig.secret, {expiresIn: 86400});
                res.status(200).send({auth:true, token: token});
            }
            return;
        })
        .catch(err => {
            console.log(err); 
        });
    });

    //Logout
    app.get("/logout", (req, res)=> {
        res.status(200).send({auth: false, token: null});
    });
};

module.exports = addRoutes;

