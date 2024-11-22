import React from 'react';
import { Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

export function Welcome() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#FCFAF9] to-[#FFF5F5]">
      <motion.div 
        className="text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="relative inline-block mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        >
          <div className="absolute inset-0 animate-pulse-slow bg-red-100 rounded-full blur-2xl opacity-50" />
          <Utensils className="w-20 h-20 relative text-[#FF6B6B] animate-float" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold text-[#333333] leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Hey chef! <br />
          What do you want to cook tonight?
        </motion.h1>
      </motion.div>
    </div>
  );
}