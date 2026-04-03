import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { translations } from '../translations';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Sparkles, Sprout } from 'lucide-react';

const FloatingLeaf = ({ index, mouseX, mouseY }) => {
  const leafX = useSpring(useTransform(mouseX, [-400, 400], [-(index + 1) * 20, (index + 1) * 20]), { stiffness: 40, damping: 25 });
  const leafY = useSpring(useTransform(mouseY, [-400, 400], [-(index + 1) * 20, (index + 1) * 20]), { stiffness: 40, damping: 25 });

  return (
    <motion.div
      animate={{
        y: [0, -40, 0],
        x: [0, 30, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 15 + index * 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        x: leafX,
        y: leafY,
        top: `${(index % 5) * 20 + 5}%`,
        // Restrict to absolute edges (0-15% and 85-100%)
        left: index % 2 === 0 ? `${(index % 4) * 4 + 1}%` : undefined,
        right: index % 2 !== 0 ? `${(index % 4) * 4 + 1}%` : undefined,
      }}
      className="absolute opacity-[0.07] text-[#006d5b] blur-[2px] select-none pointer-events-none z-0"
    >
      <Sprout size={25 + (index % 6) * 15} strokeWidth={1} />
    </motion.div>
  );
};

const Hero = () => {
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // 3D Mouse Tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-350, 350], [12, -12]), { stiffness: 80, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-350, 350], [-12, 12]), { stiffness: 80, damping: 25 });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banners/active/`);
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto-slide 
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 12000); // Slower transition for premium feel
    return () => clearInterval(timer);
  }, [banners.length, banners]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? 30 : -30
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 800 : -800,
      opacity: 0,
      scale: 1.05,
      rotateY: direction < 0 ? 30 : -30
    })
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="w-full h-[650px] bg-emerald-50/20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#006d5b] animate-spin" />
      </div>
    );
  }

  const defaultSlide = {
    title: t.hero_title || "Nature's Wisdom, Modern Science.",
    description: t.hero_desc || "Discover the purest Ayurvedic formulations crafted for your well-being. Balance your life with Shrigurudeo Ayurved.",
    image_url: null,
    link_url: '#'
  };

  const currentBanners = banners.length > 0 ? banners : [defaultSlide];

  return (
    <div
      className="relative w-full h-[650px] bg-[#f8faf7] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative Floating 3D Particles - Pushed to absolute edges */}
      {[...Array(16)].map((_, i) => (
        <FloatingLeaf key={i} index={i} mouseX={x} mouseY={y} />
      ))}

      {/* Animated Background Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[150px] pointer-events-none"
      />

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500;
            if (swipe && offset.x > 0) prevSlide();
            else if (swipe && offset.x < 0) nextSlide();
          }}
          transition={{
            x: { type: "spring", stiffness: 80, damping: 20 },
            opacity: { duration: 0.8 },
            rotateY: { duration: 1 }
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          className="absolute inset-0 z-10 p-4 md:p-8 cursor-grab active:cursor-grabbing"
        >
          {/* Single Unified 3D Banner Card */}
          <div className="relative w-full h-full max-w-[1400px] mx-auto rounded-[60px] overflow-hidden bg-[#fdfbf6] shadow-[0_50px_100px_rgba(0,0,0,0.12)] border border-white/50 group select-none">

            {/* Background Image Layer (Full Banner) */}
            <div className="absolute inset-0 z-0">
              {currentBanners[currentIndex].image_url ? (
                <div className="w-full h-full relative">
                  <img
                    src={currentBanners[currentIndex].image_url}
                    alt=""
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#003d29]/80 via-[#003d29]/40 to-transparent" />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-teal-400 opacity-90" />
              )}
            </div>

            {/* Content Layer (Overlaid) */}
            <div className="relative z-10 w-full h-full flex items-center px-8 md:px-20">
              <div className="max-w-3xl space-y-8" style={{ transform: "translateZ(100px)" }}>

                {/* Sale / Status Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-400 text-emerald-950 rounded-full font-black text-xs uppercase tracking-widest shadow-xl"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  Limited Time Winter Sale • 30% Off
                </motion.div>

                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-[6rem] font-black leading-[1] tracking-tight text-white drop-shadow-2xl"
                >
                  {currentBanners[currentIndex].title}
                </motion.h1>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-lg md:text-2xl max-w-xl font-medium leading-relaxed drop-shadow-lg"
                >
                  {currentBanners[currentIndex].description}
                </motion.p>

                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 flex flex-wrap gap-5"
                >
                  <button className="bg-[#ff6b3d] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#e85a2d] transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3">
                    Shop Now
                  </button>

                  <button className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2">
                    Learn More
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Floating Decorative Elements (Specific to this slide) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-40 h-40 bg-white/5 border border-white/10 rounded-full blur-2xl pointer-events-none"
            />
            <motion.div
              animate={{ y: [0, 30, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Simplified Modern Controls (Only Dots) */}
      {currentBanners.length > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-30 flex gap-4 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          {currentBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`transition-all duration-500 rounded-full ${
                currentIndex === idx ? 'w-12 bg-[#ff6b3d]' : 'w-3 bg-white/40 hover:bg-white/60'
              } h-3`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
