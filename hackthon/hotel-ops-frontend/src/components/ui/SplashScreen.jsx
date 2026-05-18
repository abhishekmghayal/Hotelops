import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2500); // Splash screen duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-hotel-navy overflow-hidden"
        >
          {/* Background animations */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.2, scale: 1.5 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className="absolute w-[800px] h-[800px] bg-hotel-gold rounded-full blur-[120px]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.15, scale: 2 }}
            transition={{ duration: 3, ease: 'easeOut', delay: 0.2 }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-hotel-sky rounded-full blur-[100px]"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Try to load logo, fallback to text if missing */}
            <div className="w-48 h-48 mb-6 flex items-center justify-center bg-white rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] p-4">
              <img 
                src="/logo.png" 
                alt="HotelOps Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden text-hotel-navy font-bold text-4xl text-center items-center justify-center h-full w-full">
                HotelOps
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white tracking-wider mb-3">
              Hotel<span className="text-hotel-gold">Ops</span>
            </h1>
            <p className="text-hotel-sky/80 text-lg tracking-widest font-light uppercase">
              Smart. Efficient. Reliable.
            </p>
            
            {/* Loading indicator */}
            <div className="mt-12 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: ['0%', '-50%', '0%'],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 rounded-full bg-hotel-gold"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
