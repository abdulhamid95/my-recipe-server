const models = require('../models');
const fs = require('fs/promises')

exports.newPost = async (req, res) => {
    const {title, contents, steps, country, region} = req.body;
    const url = req.protocol + '://' + req.get('host') + '/public/images/';
    try{
        const post = await models.Post.create(
            {
                title,
                contents,
                steps,
                country,
                region,
                userId: req.currentUser.id,               
            }
        );
        req.files.map(async function(file) {
            const post_img = await models.Post_Image.create(
                {
                    img_uri: url + file.filename,
                    postId: post.id
                }
            )
        });
        res.status(200).json({message: 'تم إضافة منشور جديد'});
    } catch(e) {
        res.status(500).json(e);
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const getPosts = await models.Post.findAll({
            include: [
                {
                    model: models.User,
                    attributes: {exclude: ['password', 'email']}
                },
                {
                    model: models.Post_Image
                }
            ]
        });
        res.status(200).json(getPosts);
    } catch(e) {
        res.status(500).json(e);
    }
}

exports.getPost = async (req, res) => {
    try {
        const post = await models.Post.findOne({
            where: {id: req.params.postId},
            include: [
                {
                    model: models.User,
                    attributes: {exclude: ['password', 'email']}
                },
                {
                    model: models.Post_Image
                }
            ]
        });
        res.status(200).json(post);
    } catch(e) {
        res.status(500).json(e);
    }
};

exports.getAllMyPosts = async (req, res) => {
    try {
        const myPosts = await models.Post.findAll({
            where: {userId: req.currentUser.id},
            include: [
                {
                    model: models.Post_Image
                }
            ]
        });
        res.status(200).json(myPosts);
    } catch(e) {
        res.status(500).json(e);
    }
}

exports.getMyPost = async (req, res) => {
    try {
        const myPost = await models.Post.findOne({
            where: {
                    userId: req.currentUser.id,
                    id: req.params.postId
                    }
        });
        res.status(200).json(myPost);
    } catch(e) {
        res.status(500).json(e);
    }
};

exports.updateMyPost = async (req, res) => {
    const {title, contents, steps} = req.body;
    try {
        const updatePost = await models.Post.update(
            {
                title,
                contents,
                steps
            },
            {
                where: {
                    id: req.params.postId,
                    userId: req.currentUser.id
                }
            }
        );
        res.status(200).json({
            message: "تم تعديل منشورك بنجاح"
        })
    } catch(e) {
        res.status(500).json(e)
    }
};

exports.deleteMyPost = async (req, res) => {
    const {postId} = req.body;
    try{
        await models.Post_Image.findAll({
            where: {postId: postId}
        }).then((res) => {
            res.map((img) => {
                fs.unlink('./public/images/'+ img.img_uri.split("/")[5],function (err) {
                    if (err) throw err})
            })
        });
        await models.Post_Image.destroy({
            where: {postId: postId}
        });
        await models.Comment.destroy({
            where: {postId: postId}
        });
        await models.Like.destroy({
            where: {postId: postId}
        });
        await models.Post.destroy({
            where: {id: postId}
        });
        res.status(200).json({message: "تم حذف منشورك بنجاح"});
    } catch(e) {
        res.status(500).json(e);
    }
}