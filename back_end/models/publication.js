'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publicationr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Publication.belongsTo(models.User, {
        foreignKey : {
          allowNull: false
        }
      });
      models.Publication.hasMany(models.Commentaire)
    }
  };
  Publicationr.init({
    utilisateur_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    image: DataTypes.STRING,
    like: DataTypes.INTEGER,
    dislike: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publicationr;
};