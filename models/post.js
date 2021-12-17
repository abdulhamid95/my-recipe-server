const Sequelize = require('sequelize');
const db = require('./database')

const Post = db.define('post', {
    title: {
        type: Sequelize.DataTypes.STRING
    },
    contents: {
        type: Sequelize.DataTypes.STRING
    },
    steps: {
        type: Sequelize.DataTypes.JSON,
    },
    country: {
        type: Sequelize.DataTypes.STRING,
    },
    region: {
        type: Sequelize.DataTypes.STRING,
    }
});

Post.associate = models => {
    Post.belongsTo(models.User);
    Post.hasMany(models.Post_Image);
    Post.hasMany(models.Comment);
}

module.exports = Post;