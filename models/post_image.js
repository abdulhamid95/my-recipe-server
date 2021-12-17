const Sequelize = require('sequelize');
const db = require('./database')

const Post_Image = db.define('post_image', {
    img_uri: {
        type: Sequelize.DataTypes.STRING
    }
}, {
    timestamps: false
});

Post_Image.associate = models => {
    Post_Image.belongsTo(models.Post);
}

module.exports = Post_Image;