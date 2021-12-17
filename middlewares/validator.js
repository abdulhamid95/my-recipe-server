const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('اسم المستخدم مطلوب'),
        body('email').notEmpty().withMessage('البريد الإلكتروني مطلوب'),
        body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
        body('password').isLength({ min: 5 }).withMessage('كلمة المرور يجب أن تكون أكثر من خمسة محارف'),
    ]
}

const updateUserValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('الاسم مطلوب'),
    body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
    body('password').isLength({ min: 5 }).withMessage('كلمة المرور يجب أن تكون أكثر من خمسة محارف'),
  ]
};

const postValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('العنوان مطلوب'),
    body('contents').notEmpty().withMessage('المكونات مطلوب'),
    body('steps').notEmpty().withMessage('الخطوات مطلوب')
  ]
};

const commentValidationRules = () => {
  return [
    body('text').notEmpty().withMessage('يجب عليك كتابة تعليق'),
  ]
};

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: extractedErrors,
    })
}

module.exports = {
    userValidationRules,
    updateUserValidationRules,
    postValidationRules,
    commentValidationRules,
    validate
}