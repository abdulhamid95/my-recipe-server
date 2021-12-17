const models = require('../models');

exports.like = async (req, res) => {
    try{
        const userLiked = await models.Like.findOne({
            where: {userId: req.currentUser.id, postId: req.params.postId}
        })
        if(userLiked){
            await models.Like.destroy({
                where: {userId: req.currentUser.id, postId: req.params.postId}
            });
            res.status(200).json({message: "تم حذف الإعجاب"})
        } else {
            await models.Like.create({
                userId: req.currentUser.id,
                postId: req.params.postId
            });
            res.status(200).json({message: "تم إضافة الإعجاب"})
        }
    } catch(e) {
        res.status(500).json(e.message)
    }

};

exports.likeCount = async (req, res) => {
    try {
        const likes = await models.Like.findAll({
            where: {postId: req.params.postId}
        });
        const userLiked = await models.Like.findOne({
            where: {userId: req.currentUser.id, postId: req.params.postId}
        });
        res.status(200).json({
            likes: likes.length,
            userLiked
        })
    } catch(e) {
        res.status(500).json(e)
    }
}