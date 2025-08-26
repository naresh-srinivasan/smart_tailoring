import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Measurement = sequelize.define("Measurement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id', // This maps userId in code to user_id in database
  },
  person_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSONB,  // Store the entire measurement object
    allowNull: true,
  },
}, {
  schema: "smart_schema",
  tableName: "measurements",
  timestamps: true,
});

export default Measurement;