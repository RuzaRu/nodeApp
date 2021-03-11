const users = require("../controllers/user.controller");
const{check, validationResult} = require("express-validator");
const verifyToken= require("../controllers/verifytoken");

let validation = [
    check('firstName', 'First name must have at least 3 characters').isLength({min: 3}),
    check('lastName', 'Last name must have at least 3 characters').isLength({min: 3}),
    check('companyName', 'Company name must have at least 3 characters').isLength({min: 3}),
    check('email', 'Email format is invalid').isEmail(),
    check('password', 'Password must have at least 3 characters').isLength({min: 7})
]


function addRoutes(app) {
    app.get("/", (req,res) => {
        res.json({message: "Welcome!"});
    });
    
    //Create new user
    app.post("/api/create", validation, users.createUser);
    
    //Get user by name
    app.get("/api/user/:firstName", verifyToken, users.findUserByName);
    
    //Get user by id
    app.get("/api/userId/:id", verifyToken, users.findUserById);
    
    //Delete user by id
    app.delete("/api/delete/:id", verifyToken, users.deleteUser);
    
    //Update user by id
    app.put("/api/update/:id", verifyToken, users.updateUser);
    
    //Find all users
    app.get("/api/find/all", verifyToken, users.findAllUsers);
}




module.exports = addRoutes;