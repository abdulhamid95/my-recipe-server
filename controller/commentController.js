const models = require('../models');

exports.creteComment = async (req, res) => {
    const {text} = req.body;
    try {
        const comment = await models.Comment.create({
            text,
            postId: req.params.postId,
            userId: req.currentUser.id
        });
        res.status(200).json({message: "تم إضافة التعليق"})
    } catch(e){
        res.status(500).json(e);
    }
}

exports.getComments = async (req, res) => {
    try {
        const comments = await models.Comment.findAll({
            where: {postId: req.params.postId},
            include: [
                {
                    model: models.User,
                    attributes: {exclude: ['email', 'password']}
                }
            ]
        });
        res.status(200).json(comments);
    } catch(e) {
        res.status(500).json(e);
    }
}