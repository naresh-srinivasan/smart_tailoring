
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSON, // array or object of order items
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  delivery_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expected_delivery: {
    type: DataTypes.DATE,
    allowNull: true,
  }, cancelReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feedback_text: {
    type: DataTypes.TEXT,
    allowNull: true,   // optional
  },
  feedback_rating: {
    type: DataTypes.INTEGER,
    allowNull: true,   // optional
    validate: {
      min: 1,
      max: 5
    }
  }, pendingAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  orderAcceptedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  outForDeliveryAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  delivery_otp: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  otp_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  schema: 'smart_schema',
  tableName: 'orders',
  timestamps: true,
},);

export default Order;