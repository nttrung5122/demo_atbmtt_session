const User = require('../models/User.model');
const bcrypt = require('bcrypt');

// const blackListToken=[];
const authController = {

    registerUser: async (req,res)=> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password,salt);
            
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
            })

            const user = await newUser.save();
            res.status(200).json(user);

        } catch (error) {
            res.status(500).json(error);
        }
    },

    logIn: async (req, res) => {
        // return res.status(200).json(req.body.password);
        try {
            const user = await User.findOne({username: req.body.username});

            if(!user){
                return res.status(404).json("wrong username");
            }
            const validPassword = await bcrypt.compare( req.body.password,user.password);

            if(!validPassword){
                return res.status(404).json("wrong password");
            }
            if(user && validPassword){
                const {password,refreshKey, ...others} = user._doc;
                
                req.session.user = others;
                return res.status(200).json({
                    user:others,
                    
                });
                // res.status(200).json({others});
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    
    logOut: async (req, res) => {
        if (req.session) {
            // delete session object
            req.session.destroy(function(err) {
              if(err) {
                return res.status(500).json(err);

              } else {
                return res.status(200).json("Logout: ...");
              }
            });
          }
        return res.status(200).json("Logout: ...");
    }
}

module.exports = authController;