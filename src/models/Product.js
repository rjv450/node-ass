import { Sequelize, DataTypes } from 'sequelize';

// Define the Product  model for Sequelize
export default (sequelize) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    timestamps: true
  });

  return Product;
};
