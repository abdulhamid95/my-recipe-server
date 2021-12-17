const bcrypt = require('bcrypt');
const models = require('../models');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const hashPassword = await bcrypt.hash(password, 10);
        const emailFound = await models.User.findOne({where: {email}});
        if(emailFound === null){
            const user = await models.User.create({
                name,
                email,
                password: hashPassword
            })
            res.status(200).json({message: "تم إنشاء حسابك بنجاح"});
        } else {
            res.status(400).json({message: "هذا البريد الإلكتروني مستخدم مسبقًا!"})
        }
    } catch(e) {
        res.status(500).json(e.message);
    }
} 

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await models.User.findOne({where: {email}});
        if(user === null) {
            res.status(401).json({message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"});
        } else {
            const pass = await bcrypt.compare(password, user.password);
            if(pass) {
                const token = jwt.sign({
                    id: user.id,
                    email: user.email
                }, process.env.JWT);
                res.status(200).json({accessToken: token})
            } else {
                res.status(401).json({message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"})
            }
        }
    } catch(e) {
        res.status(500).json(e);
    }
}

exports.getProfile = async (req, res ) => {
    try {
        const user = await models.User.findOne({
            where: {id: req.currentUser.id},
            attributes: {exclude: ['password']}
        });
        res.status(200).json(user);
    } catch(e) {
        res.status(500).json(e);
    }
}

exports.uploadUserPhoto = async (req, res) => {
    try{
        const url = req.protocol + '://' + req.get('host');
        const uploadPhoto = await models.User.update(
            {
            img_uri: url + '/public/images/' + req.file.filename
            },
            {where: {id: req.currentUser.id}}
        )
        res.status(200).json({
            message: "تم إضافة الصورة بنجاح"
        })
    } catch(e) {
        res.status(500).json(e.message)
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const {name, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const updateProfile = await models.User.update(
            {
                name,
                password: hashPassword,
            },
            {where: {id: req.currentUser.id}}
        )
        res.status(200).json({message: "تم تعديل البيانات الشخصية بشكل صحيح"})
    } catch(e) {
        res.status(500).json(e)
    }
}