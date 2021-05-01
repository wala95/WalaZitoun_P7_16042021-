'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commentaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Commentaire.belongsTo(models.User, {
        foreignKey : {
          name: 'utilisateur_id',
          allowNull: false
        }
      },  {onDelete: 'CASCADE' });
      models.Commentaire.belongsTo(models.Publication, {
        foreignKey : {
          name: 'publication_id',
          allowNull: false
        }
      }, {onDelete: 'CASCADE' });
    }
  };
  Commentaire.init({
    utilisateur_id: DataTypes.INTEGER,
    publication_id: DataTypes.INTEGER,
    content: DataTypes.STRING
  
  }, {
    sequelize,
    modelName: 'Commentaire',
  });
  return Commentaire;
};