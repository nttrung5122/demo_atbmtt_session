
const  authMiddleware = {

    verify: (req, res, next) => {
        if (req.session && req.session.user) {
            return next();
        } 
        return res.status(401).json('You must be logged .')
    },

    verifyAdminAuth: (req,res,next)=>{
        authMiddleware.verify(req,res,() => {
            if(req.session.user.type === 'admin' || req.session.user._id === req.params.id){
                return next();
            }
            return res.status(401).json('You must be logged in with admin');
        })
    }


}

module.exports = authMiddleware;