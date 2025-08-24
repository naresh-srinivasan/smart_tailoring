import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // adjust path to your Sequelize instance

const PromoCode = sequelize.define(
  "PromoCode",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true, // null = unlimited usage
    },
    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    schema : "smart_schema",
    tableName: "promo_codes",
    timestamps: true,
  }
);

// Optional helper method to check if promo is valid
PromoCode.prototype.isValid = function () {
  const now = new Date();
  return this.isActive && now >= this.validFrom && now <= this.validTo;
};

export default PromoCode;
