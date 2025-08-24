// models/MaterialUsageLog.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // your Sequelize instance
import Inventory from "./Inventory.js";

const MaterialUsageLog = sequelize.define("MaterialUsageLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Inventory,
      key: "id",
    },
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // null if added manually to stock
  },
  quantity_used: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  action_type: {
    type: DataTypes.ENUM("deduction", "addition"),
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "material_usage_log",
  timestamps: false,
});

export default MaterialUsageLog;
    