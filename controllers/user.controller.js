const db = require("../model");
const jwt = require("jsonwebtoken");
const{check, validationResult} = require("express-validator");
const auth = require("../config/auth.config");


const User = db.user;

//Create and save new user

function createUser(req, res) {

    var errors= validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
    }
   
    else {
        const user = new User ({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            companyName: req.body.companyName
          });
        
          user.save(user)
          .then(data => {
            var userId = data.id;
            var token= jwt.sign({id: userId}, auth.secret, {expiresIn: 86400});
           
            res.status(200).send({auth: true, token: token, user: data});
          })
          .catch(err => {
              res.status(500).send({error: err.message || "Error while creating user"});
          })  
    }
};

//Find user by name

function findUserByName(req, res) {

    const firstName= req.params.firstName;
    var condition = firstName ? {firstName: {$regex: new RegExp(firstName), $options: "i"}} : {};

    User.find(condition)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({message: err.message || "Error while retrieving user"});
    });
    };

    function checkUserEmail(email) {
        var condition =  {
            email: {$regex: new RegExp(email)}
         };
     
         
     
         return User.find(condition);
    }


//Find user by id
function findUserById(req, res) {

    var userId= req.params.id;
    if (!userId) {
        res.status(400).send({message: "There is no user id"});
    }
    
    User.findById(userId)
    .then(user => {
        res.status(200).send(user);
    })
    .catch(err => {
        res.status(500).send({message: err.message || "Error while retreiving user"});
    })
};


//Find all users

    function findAllUsers(req, res) {
        User.find()
            .sort({name: -1})
            .then(users => {
                res.send(users);
            })
            .catch(err => {
                res.status(500).send({message: err.message || "Error while retrieving users"});
            });
    };

//Update user

function updateUser (req, res) {
    if (!req.params.id) {
        res.status(400).send({message: "There is no user id"});
    }

User.findByIdAndUpdate(req.params.id, req.body,{new: true})
    .then((user) => {
        res.status(200).send(user);
         })
    .catch(err => {
             res.status(500).send({message: err.message || "Error while updating user"});
         });
};


//Delete user by id

function deleteUserById(req,res) {
  
    // Validate request
    if (!req.params.id) {
     res.status(400).send({message: "There is no user id"});
 }
     
     User.findByIdAndRemove(req.params.id)
   
         .then(() => {
             res.send({message:"User deleted successfully!"});
         })
         .catch(err => {
             res.status(500).send({message: err.message || "Error while deleting user"});
         });
 };


module.exports = {
    createUser: createUser,
    updateUser: updateUser,
    findUserByName: findUserByName,
    findUserById: findUserById,
    findAllUsers: findAllUsers,
    deleteUser: deleteUserById,
    checkUserEmail: checkUserEmail
}