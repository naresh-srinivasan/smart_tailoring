import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    material_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    }, // e.g. "Shirt Fabric"
    
    material_type: { 
      type: DataTypes.STRING, 
      allowNull: true 
    }, // e.g. "Cotton", "Silk"
    
    color: { 
      type: DataTypes.STRING, 
      allowNull: false 
    }, // e.g. "Red", "Blue"
    
    color_code: { 
      type: DataTypes.STRING, 
      allowNull: true 
    }, // e.g. "#FF0000"
    
    pattern: { 
      type: DataTypes.STRING, 
      allowNull: true 
    }, // e.g. "Striped", "Checked"
    
    total_quantity: { 
      type: DataTypes.FLOAT, 
      defaultValue: 0 
    },
    
    price: { 
      type: DataTypes.FLOAT, 
      defaultValue: 0 
    },
  },
  {
    tableName: "inventory",
    schema: "smart_schema", // ✅ Ensure schema exists in PostgreSQL
    timestamps: true, // createdAt & updatedAt
  }
);

export default Inventory;
