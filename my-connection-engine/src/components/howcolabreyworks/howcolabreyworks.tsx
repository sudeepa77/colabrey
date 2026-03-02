
'use client';

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import {
  Shield,
  CheckCircle,
  Tags,
  Users,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRef, useState } from "react";

const features = [
  {
    id: 1,
    title: "Real Student, Real Connection",
    description:
      "A spam-free community, only real students, no fake accounts. Join using your college email to connect safely within your campus.",
    icon: CheckCircle,
    lottieUrl:
      "https://lottie.host/4891a6a8-a1a1-4282-9605-790a0bb72c3b/7kx3Pdel9V.lottie",
    color: "text-cyan-400",
    bgColor: "bg-black",
  },
  {
    id: 2,
    title: "Text Anyone Who Matches Your Passion",
    description:
      "Add your skills or interests, search what you love, and instantly connect with students who match.",
    icon: Tags,
    lottieUrl:
      "https://lottie.host/d9adefaf-a3e4-4bd4-b4d1-54fd932413f4/QmYECLGEfA.lottie",
    color: "text-green-500",
    bgColor: "bg-black",
  },
  {
    id: 3,
    title: "Join Groups That Match Your Interests",
    description:
      "Join or create groups around what you love. From coding clubs to startup circles to sports teams—find your people and work together.",
    icon: Users,
    lottieUrl:
      "https://lottie.host/3f1e3f0e-5037-42b0-9871-ee019fad57e2/nKJhMWscXa.lottie",
    color: "text-purple-500",
    bgColor: "bg-black",
  },
  {
    id: 4,
    title: "Showcase Your Skills & Projects",
    description:
      "Add your GitHub, portfolio to your profile and let others see what you can do. Highlight your projects, skills, and achievements to attract collaborators and grow your personal brand.",
    icon: Briefcase,
    lottieUrl:
      "https://lottie.host/d41a341c-ce0b-4278-88cc-0f9bdb39e54b/y4xJ4KcDZm.lottie",
    color: "text-orange-400",
    bgColor: "bg-black",
  },
  {
    id: 5,
    title: "Build Together",
    description:
      "Looking for a co‑founder, designer, or startup team? Colabrey makes it easy to connect with the right people who have the right skills exactly when you need them.",
    icon: Users,
    lottieUrl:
      "https://lottie.host/26e0f692-27d4-4ec9-836c-dd1c2736a017/wJmxacfhGE.lottie",
    color: "text-pink-400",
    bgColor: "bg-black",
  },
  {
    id: 6,
    title: "End‑to‑End Encrypted Your Chats. Your Privacy.",
    description:
      "Every conversation is end‑to‑end encrypted. We never store, read, or share your messages. Share ideas, collaborate on projects, and make new friends, Your data stays yours, always.",
    icon: Shield,
    isHighlighted: true,
    lottieUrl:
      "https://lottie.host/72a6b127-6ff5-4ea0-b688-b2be69ad853e/zptSO5c0Ar.lottie",
    color: "text-yellow-400",
    bgColor: "bg-black",
  },
];

export default function HowColabreyWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInSection, setIsInSection] = useState(false);
  const totalSlides = features.length + 1; // +1 for header slide

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Discrete slide snapping - one scroll = one slide
  const slideProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, totalSlides - 1]
  );

  // Track when we're in the section
  const sectionProgress = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );

  // Update current slide with discrete steps
  useMotionValueEvent(slideProgress, "change", (latest) => {
    const slideIndex = Math.round(latest);
    setCurrentSlide(slideIndex);
  });

  // Update section visibility
  useMotionValueEvent(sectionProgress, "change", (latest) => {
    setIsInSection(latest > 0);
  });

  // Slide variants for pop-up animation
  const slideVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};



  // Content variants (unchanged)
  const contentVariants = {
  hidden: { opacity: 0 },
  visible: () => ({
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut"
    }
  })
};



  // Image variants (fixed - removed scale + rotate)
  const imageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};


  // Progress indicator variants (fixed - removed scale)
  const progressVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18
      }
    }
  };


  return (
    <section className="relative bg-black" ref={containerRef}>

      {/* Sticky container for centered slides */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Header Slide */}
        <motion.div
          initial="hidden"
          animate={currentSlide === 0 ? "visible" : "hidden"}
          variants={slideVariants}
          className="h-screen w-full flex items-center justify-center absolute top-0 left-0"
        >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h1
              custom={0}
              variants={contentVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              How{" "}
              <span style={{ color: "#3B82F6" }}>
                Colabrey
              </span>{" "}
              Works
            </motion.h1>

            <motion.p
              custom={1}
              variants={contentVariants}
              className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              Scroll to explore how we're revolutionizing campus networking
            </motion.p>

            <motion.div
              custom={2}
              variants={contentVariants}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-gray-500"
            >
              <span className="text-sm">Scroll to continue</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Slides - Each positioned absolutely and centered */}
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const slideIndex = index + 1;
          const isActive = currentSlide === slideIndex;

          return (
            <motion.div
              key={feature.id}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              variants={slideVariants}
              className="h-screen w-full flex items-center justify-center absolute top-0 left-0"
            >
              <div className="max-w-6xl w-full mx-auto px-4">
                <div className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                  {/* Lottie Animation */}
                  <motion.div
                    variants={imageVariants}
                    className="flex-1 max-w-2xl"
                  >
                    <div className={`relative rounded-2xl ${feature.bgColor} p-4 md:p-6`}>
                      <div
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{ aspectRatio: "4/3" }}
                      >
                        {feature.lottieUrl ? (
                          <DotLottieReact
                            src={feature.lottieUrl}
                            loop
                            autoplay
                            className="w-full h-full"
                            style={{ backgroundColor: "transparent" }}
                          />
                        ) : (
                          <div className="text-center p-8">
                            <Icon className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-emerald-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Text Content */}
                  <div className="flex-1 max-w-2xl">
                    <div className="text-center md:text-left">
                      {/* Section Number */}
                      <motion.div
                        custom={0}
                        variants={contentVariants}
                        className="flex items-center justify-center md:justify-start gap-3 mb-6"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {String(feature.id).padStart(2, "0")}
                          </span>
                        </div>
                        <span className="text-gray-600 text-sm">
                          / {String(features.length).padStart(2, "0")}
                        </span>
                      </motion.div>

                      <motion.h2
                        custom={1}
                        variants={contentVariants}
                        className={`${feature.color} text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight`}
                      >
                        {feature.title}
                      </motion.h2>

                      <motion.p
                        custom={2}
                        variants={contentVariants}
                        className="text-gray-300 text-lg md:text-xl leading-relaxed"
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial="hidden"
        animate={isInSection ? "visible" : "hidden"}
        variants={progressVariants}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="flex items-center gap-4 px-6 py-3 bg-black/70 backdrop-blur-sm border border-gray-800 rounded-full">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? "bg-white w-6"
                  : "bg-gray-600"
                  }`}
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
      </motion.div>


      {/* Spacer to create scrollable area */}
      <div
        className="relative"
        style={{
          height: `${totalSlides * 100}vh`
        }}
      />
    </section>
  );
}