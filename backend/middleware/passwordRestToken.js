// models/PasswordResetToken.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PasswordResetToken = sequelize.define("PasswordResetToken", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.BIGINT, allowNull: false },
});

export default PasswordResetToken;
