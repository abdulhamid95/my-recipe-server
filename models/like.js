const db = require('./database');

const Like = db.define('like', {}, {
    timestamps: false
});

Like.associate = models => {
    models.User.belongsToMany(models.Post, {through: "like"});
    models.Post.belongsToMany(models.User, {through: "like"});
}

module.exports = Like;