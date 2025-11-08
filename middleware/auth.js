
module.exports = {
    ensureAuthenticated:(req,res,next)=>{
       if(req.session.user) return next();
       return res.redirect('/login');
    },
    ensureNotAuthenticated:(req,res,next)=>{
       if(!req.session.user) return next();
       return res.redirect('/home');
    },
    ensureAdmin:(req,res,next)=>{
        if(req.session && req.session.admin) return next();
       return res.redirect('/admin/login')
    }
}