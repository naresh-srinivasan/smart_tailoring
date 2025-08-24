import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Measurement = sequelize.define("Measurement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dress_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSONB,  // Store the entire object
    allowNull: true,
  },
}, {
  schema: "smart_schema",
  tableName: "measurements",
  timestamps: true,
});

export default Measurement;
