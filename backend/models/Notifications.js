// models/Notification.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // adjust path

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }, 
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  schema: "smart_schema",
  tableName: "notifications",
  timestamps: true,
});



export default Notification;
