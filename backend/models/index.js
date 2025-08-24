// models/index.js
import User from './User.js';
import Order from './Order.js';
import Measurement from './Measurement.js';

// Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Measurement, { foreignKey: 'user_id' });
Measurement.belongsTo(User, { foreignKey: 'user_id' });

export { User, Order, Measurement };
    