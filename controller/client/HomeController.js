
module.exports.index = async(req,res)=>{
    res.render("client/pages/home.pug")
}
module.exports.about = async(req,res)=>{
    res.render("client/pages/about.pug")
}
module.exports.service = async(req,res)=>{
    res.render("client/pages/service.pug")
}