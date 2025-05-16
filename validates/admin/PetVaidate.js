module.exports.createPost = async (req, res,next) => {
    const { name, age, color, price } = req.body;

    if (!name) {
        req.flash('error', "Tên thú cưng không được để trống.");
        return res.redirect('back');
    }

    if (!age) {
        req.flash('error', "Vui lòng nhập tuổi của thú cưng.");
        return res.redirect('back');
    }

    if (!color) {
        req.flash('error', "Vui lòng nhập màu lông của thú cưng.");
        return res.redirect('back');
    }

    if (!price) {
        req.flash('error', "Vui lòng nhập giá của thú cưng.");
        return res.redirect('back');
    }

    next()
};
