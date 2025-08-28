import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DressTypeSelection({
  gender,
  onBack,
  onSelect,
  measurementsData,
}) {
  const [hoveredType, setHoveredType] = useState(null);
  const types = Object.keys(measurementsData[gender] || {});

  // Define icons and colors for different dress types
  const getTypeConfig = (type) => {
    const configs = {
      'Shirt': { 
        icon: '👔', 
        gradient: 'from-indigo-500 to-blue-600',
        hoverGradient: 'from-indigo-600 to-blue-700',
        bgColor: 'from-indigo-50 to-blue-50',
        description: 'Formal & casual shirts'
      },
      'Dress': { 
        icon: '👗', 
        gradient: 'from-purple-500 to-pink-600',
        hoverGradient: 'from-purple-600 to-pink-700',
        bgColor: 'from-purple-50 to-pink-50',
        description: 'Elegant dresses'
      },
      'Suit': { 
        icon: '🤵', 
        gradient: 'from-gray-600 to-slate-700',
        hoverGradient: 'from-gray-700 to-slate-800',
        bgColor: 'from-gray-50 to-slate-50',
        description: 'Professional suits'
      },
      'Blouse': { 
        icon: '👚', 
        gradient: 'from-rose-500 to-red-600',
        hoverGradient: 'from-rose-600 to-red-700',
        bgColor: 'from-rose-50 to-red-50',
        description: 'Stylish blouses'
      },
      'Kurta': { 
        icon: '🥻', 
        gradient: 'from-orange-500 to-amber-600',
        hoverGradient: 'from-orange-600 to-amber-700',
        bgColor: 'from-orange-50 to-amber-50',
        description: 'Traditional kurtas'
      },
      'T-Shirt': { 
        icon: '👕', 
        gradient: 'from-green-500 to-emerald-600',
        hoverGradient: 'from-green-600 to-emerald-700',
        bgColor: 'from-green-50 to-emerald-50',
        description: 'Comfortable t-shirts'
      }
    };
    
    return configs[type] || {
      icon: '👔',
      gradient: 'from-indigo-500 to-purple-600',
      hoverGradient: 'from-indigo-600 to-purple-700',
      bgColor: 'from-indigo-50 to-purple-50',
      description: 'Custom garment'
    };
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-12 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center" variants={itemVariants}>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          Choose {gender}'s Garment Type
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the type of garment you'd like to create from our premium collection
        </p>
      </motion.div>

      {/* Dress Type Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        variants={itemVariants}
      >
        {types.map((type, index) => {
          const config = getTypeConfig(type);
          return (
            <motion.button
              key={type}
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-500 p-8 min-h-[220px] ${
                hoveredType === type 
                  ? 'border-indigo-300 shadow-2xl shadow-indigo-500/20' 
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
              onMouseEnter={() => setHoveredType(type)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => onSelect(type)}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${config.bgColor} opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/15 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500" />
              
              {/* Content */}
              <div className="relative flex flex-col items-center justify-center space-y-6 h-full text-center">
                {/* Icon */}
                <motion.div 
                  className={`p-4 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.15 
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-white text-4xl">
                    {config.icon}
                  </span>
                </motion.div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {type}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {config.description}
                  </p>
                </div>

                {/* Select Button */}
                <motion.div
                  className={`px-6 py-3 bg-gradient-to-r ${config.gradient} hover:${config.hoverGradient} text-white rounded-lg font-semibold shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center space-x-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Select {type}</span>
                  <motion.div
                    animate={{ 
                      x: hoveredType === type ? 3 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.div>
                </motion.div>
              </div>

              {/* Animated Border */}
              <motion.div 
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `linear-gradient(45deg, ${hoveredType === type ? 'rgba(99, 102, 241, 0.3)' : 'transparent'}, ${hoveredType === type ? 'rgba(147, 51, 234, 0.3)' : 'transparent'})`
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-50 hover:to-purple-50 text-gray-700 hover:text-gray-800 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-indigo-200"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.05, 
          x: -5,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="text-xl"
          animate={{ x: 0 }}
          whileHover={{ x: -3 }}
          transition={{ duration: 0.2 }}
        >
          ←
        </motion.span>
        <span>Back to Gender Selection</span>
      </motion.button>

      {/* Footer Info */}
      <motion.div 
        className="text-center space-y-2 max-w-lg mx-auto"
        variants={itemVariants}
      >
        <p className="text-sm text-gray-500">
          Each garment is crafted with premium materials and precise measurements for the perfect fit
        </p>
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Premium Quality</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Custom Fit</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Fast Delivery</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
