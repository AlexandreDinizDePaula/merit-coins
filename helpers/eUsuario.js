module.exports = {
    eUsuario: function(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin == 0){
            return next()
        }
        req.flash('error', 'Você deve estar cadastrado')
        res.redirect('/')
    }
}