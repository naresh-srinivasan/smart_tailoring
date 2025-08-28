import React, { useState } from "react";
import { motion } from "framer-motion";

export default function GenderSelection({ onSelect }) {
  const [hoveredGender, setHoveredGender] = useState(null);
  
  const genderOptions = [
    {
      value: "Men",
      icon: "👔",
      gradient: "from-indigo-500 to-blue-600",
      hoverGradient: "from-indigo-600 to-blue-700",
      description: "Men's Collection",
      accent: "indigo"
    },
    {
      value: "Women", 
      icon: "👗",
      gradient: "from-purple-500 to-indigo-600",
      hoverGradient: "from-purple-600 to-indigo-700",
      description: "Women's Collection",
      accent: "purple"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
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
      className="flex flex-col items-center gap-12 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center" variants={itemVariants}>
        <p className="text-xl text-gray-700 font-semibold mb-2">
          Select your style preference:
        </p>
        <p className="text-gray-500">
          Choose to explore our curated collections
        </p>
      </motion.div>

      {/* Gender Cards */}
      <motion.div 
        className="flex gap-8 flex-wrap justify-center w-full"
        variants={itemVariants}
      >
        {genderOptions.map((option, index) => (
          <motion.button
            key={option.value}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-500 p-8 min-w-[280px] ${
              hoveredGender === option.value 
                ? 'border-indigo-300 shadow-2xl shadow-indigo-500/20' 
                : 'border-gray-200 hover:border-indigo-200'
            }`}
            onMouseEnter={() => setHoveredGender(option.value)}
            onMouseLeave={() => setHoveredGender(null)}
            onClick={() => onSelect(option.value)}
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              scale: 1.03,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-100/20 to-indigo-100/20 rounded-full blur-lg group-hover:scale-110 transition-transform duration-500" />
            
            {/* Content */}
            <div className="relative flex flex-col items-center space-y-6 text-center">
              {/* Icon */}
              <motion.div 
                className={`p-4 rounded-xl bg-gradient-to-br ${option.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ 
                  rotate: [0, -5, 5, 0],
                  scale: 1.1 
                }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white text-3xl">
                  {option.icon}
                </span>
              </motion.div>

              {/* Title */}
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {option.value}
                </h4>
                <p className="text-gray-600 font-medium">
                  {option.description}
                </p>
              </div>

              {/* CTA */}
              <motion.div
                className={`mt-4 px-6 py-3 bg-gradient-to-r ${option.gradient} hover:${option.hoverGradient} text-white rounded-lg font-semibold shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center space-x-2`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Choose {option.value}</span>
                <motion.div
                  animate={{ 
                    x: hoveredGender === option.value ? 3 : 0,
                    opacity: hoveredGender === option.value ? 1 : 0.7
                  }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.div>
              </motion.div>
            </div>

            {/* Hover Border Effect */}
            <motion.div 
              className="absolute inset-0 rounded-2xl border-2 border-transparent"
              animate={{
                borderColor: hoveredGender === option.value ? 
                  (option.accent === 'indigo' ? 'rgb(99 102 241)' : 'rgb(147 51 234)') : 
                  'transparent'
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Additional Info */}
      <motion.div 
        className="text-center text-sm text-gray-500"
        variants={itemVariants}
      >
        <p>Don't worry, you can explore both collections anytime</p>
      </motion.div>
    </motion.div>
  );
}
