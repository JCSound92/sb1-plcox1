import { Toaster } from 'react-hot-toast';
import { ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Toast() {
  return (
    <Toaster
      position="custom"
      containerStyle={{
        position: 'fixed',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '48rem',
        padding: '0 1rem'
      }}
      toastOptions={{
        duration: 2000, // Reduced from 3000 to 2000ms
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
        success: {
          icon: null,
        },
        error: {
          icon: null,
        },
      }}
    >
      {(t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              t.type === 'error' ? 'bg-red-500' : 'bg-[#FF6B6B]'
            }`}>
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed">{t.message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </Toaster>
  );
}