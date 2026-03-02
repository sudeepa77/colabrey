import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";


export function GetStarted() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tight transitions - one slide per scroll with no gaps
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 0.5, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // Step 1 appears immediately after hero starts fading
  const step1Opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.4, 0.6], [0, 1, 1, 0]);
  const step1Scale = useTransform(scrollYProgress, [0.1, 0.2, 0.4, 0.6], [0.8, 1, 1, 0.8]);
  const step1Y = useTransform(scrollYProgress, [0.1, 0.2], [100, 0]);

  // Step 2 appears immediately after step 1 starts fading
  const step2Opacity = useTransform(scrollYProgress, [0.4, 0.6, 0.8, 0.9], [0, 1, 1, 0]);
  const step2Scale = useTransform(scrollYProgress, [0.4, 0.6, 0.8, 0.9], [0.8, 1, 1, 0.8]);
  const step2Y = useTransform(scrollYProgress, [0.4, 0.6], [100, 0]);

  // Final appears immediately after step 2 starts fading
  const finalOpacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const finalScale = useTransform(scrollYProgress, [0.8, 0.9], [0.8, 1]);
  const finalY = useTransform(scrollYProgress, [0.8, 0.9], [100, 0]);

  return (
    <div ref={containerRef} className="relative bg-black">
      {/* Hero Section */}
      <motion.section
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          y: heroY
        }}
        className="sticky top-0 h-screen flex items-center justify-center bg-black"
      >
        <div className="text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-semibold mb-6 text-white"
          >
            Get Started in <span style={{ color: '#3B82F6' }}>Minutes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white"
          >
            Just two simple steps to get access
          </motion.p>
        </div>

        {/* Background dots for hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Step 1: Sign Up */}
      <section className="relative h-screen bg-black">
        <motion.div
          style={{
            opacity: step1Opacity,
            scale: step1Scale,
            y: step1Y
          }}
          className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              className="space-y-6"
              style={{
                opacity: step1Opacity,
              }}
            >
              <h2 className="text-5xl text-white">
                Sign Up with Your College Email
              </h2>
              <p className="text-xl text-slate-400">
                Connect with your academic community using your verified college email address.
                It&apos;s quick, secure, and gives you instant access.
              </p>
              <div className="flex items-center gap-3 text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Verified & Secure</span>
              </div>
            </motion.div>
            <motion.div
              style={{
                opacity: step1Opacity,
              }}
              className="relative"
            >
              {/* Orbital System */}
              <div className="absolute inset-0 -left-32 -right-32 -top-32 -bottom-32 pointer-events-none">
                {/* Outer orbit ring */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  <motion.ellipse
                    cx="50%"
                    cy="50%"
                    rx="300"
                    ry="250"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </svg>

                {/* Inner orbit ring */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  <motion.ellipse
                    cx="50%"
                    cy="50%"
                    rx="220"
                    ry="180"
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
                  />
                </svg>

                {/* Gmail logo orbiting */}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="absolute"
                    style={{
                      left: "280px",
                      top: "-20px",
                      translateX: "-50%",
                      translateY: "-50%",
                    }}
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center border border-emerald-200/50">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M28 16c0 6.627-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4c2.913 0 5.578 1.041 7.657 2.765L20 10.8c-1.14-.816-2.54-1.3-4-1.3-3.866 0-7 3.134-7 7s3.134 7 7 7c3.167 0 5.831-2.102 6.715-5H16v-4.4h12c.135.793.205 1.608.205 2.44C28.205 16.847 28.111 17.43 28 16z" fill="#4285F4" />
                        <path d="M28 16c0-.54-.044-1.067-.127-1.58H16v4.4h6.715C22.169 21.898 19.167 24 16 24c-3.866 0-7-3.134-7-7 0-1.35.383-2.61 1.047-3.684l-3.53-2.844C5.035 12.39 4 14.094 4 16c0 6.627 5.373 12 12 12 5.745 0 10.558-4.031 11.753-9.42.052-.236.092-.477.12-.72H28z" fill="#34A853" />
                        <path d="M9.047 13.316C9.684 12.242 10.748 11.454 12 11.1L8.47 8.256C6.57 9.837 5.35 12.156 5.35 14.8c0 .934.13 1.837.37 2.694l3.327-2.678c-.033-.27-.05-.544-.05-.816z" fill="#FBBC05" />
                        <path d="M16 9.5c1.46 0 2.86.584 3.94 1.56l2.78-2.795C20.578 5.041 17.913 4 16 4 11.746 4 8.13 6.377 6.47 9.756l3.53 2.844C10.748 10.954 13.134 9.5 16 9.5z" fill="#EA4335" />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Outlook logo orbiting */}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="absolute"
                    style={{
                      left: "-200px",
                      top: "140px",
                      translateX: "-50%",
                      translateY: "-50%",
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center border border-blue-200/50">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M4 6.5C4 5.67157 4.67157 5 5.5 5H26.5C27.3284 5 28 5.67157 28 6.5V25.5C28 26.3284 27.3284 27 26.5 27H5.5C4.67157 27 4 26.3284 4 25.5V6.5Z" fill="#0078D4" />
                        <path d="M16 16.5C16 18.9853 14.2091 21 12 21C9.79086 21 8 18.9853 8 16.5C8 14.0147 9.79086 12 12 12C14.2091 12 16 14.0147 16 16.5Z" fill="white" />
                        <path d="M12 18.5C13.1046 18.5 14 17.6046 14 16.5C14 15.3954 13.1046 14.5 12 14.5C10.8954 14.5 10 15.3954 10 16.5C10 17.6046 10.8954 18.5 12 18.5Z" fill="#0078D4" />
                        <path d="M17 12H24V14H17V12Z" fill="white" fillOpacity="0.9" />
                        <path d="M17 15.5H24V17.5H17V15.5Z" fill="white" fillOpacity="0.7" />
                        <path d="M17 19H21V21H17V19Z" fill="white" fillOpacity="0.6" />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Small orbit dots */}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" style={{ left: "180px", top: "-80px" }} />
                </motion.div>

                <motion.div
                  className="absolute left-1/2 top-1/2"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" style={{ left: "-150px", top: "60px" }} />
                </motion.div>

                <motion.div
                  className="absolute left-1/2 top-1/2"
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" style={{ left: "100px", top: "170px" }} />
                </motion.div>
              </div>

              <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-500/20 relative z-20">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-white">Create Account</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">College Email</label>
                      <div className="h-12 bg-black/50 rounded-lg px-4 flex items-center border-2 border-emerald-500/30 shadow-inner">
                        <span className="text-white">student@college.ac.in</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Password</label>
                      <div className="h-12 bg-black/50 rounded-lg px-4 flex items-center border border-zinc-700/50 shadow-inner">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center text-white mt-6 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-shadow cursor-pointer">
                    Continue
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Background stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
                animate={{
                  opacity: [0.1, 0.5, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Step 2: Build Profile */}
      <section className="relative h-screen bg-black">
        <motion.div
          style={{
            opacity: step2Opacity,
            scale: step2Scale,
            y: step2Y
          }}
          className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              style={{
                opacity: step2Opacity,
              }}
              className="relative order-2 md:order-1"
            >
              <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue-500/20 relative z-20">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-white">Your Profile</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Full Name</label>
                      <div className="h-12 bg-black/50 rounded-lg px-4 flex items-center border-2 border-blue-500/30 shadow-inner">
                        <span className="text-white">Tara</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Major</label>
                      <div className="h-12 bg-black/50 rounded-lg px-4 flex items-center border border-zinc-700/50 shadow-inner">
                        <span className="text-white">Computer Science and Engineering</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Graduation Year</label>
                      <div className="h-12 bg-black/50 rounded-lg px-4 flex items-center border border-zinc-700/50 shadow-inner">
                        <span className="text-white">2027</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center text-white mt-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow cursor-pointer">
                    Complete Profile
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6 order-1 md:order-2"
              style={{
                opacity: step2Opacity,
              }}
            >
              <h2 className="text-5xl text-white">
                Build Your Profile
              </h2>
              <p className="text-xl text-slate-400">
                Showcase who you are. Add your details, interests, and what makes you unique.
                Let your profile tell your story.
              </p>
              <div className="flex items-center gap-3 text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Personalized & Unique</span>
              </div>
            </motion.div>
          </div>

          {/* Background stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
                animate={{
                  opacity: [0.1, 0.5, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final Section - Enhanced Glassmorphic Button with Inverted Half Circle */}
      <section className="relative  flex items-center justify-center bg-black overflow-hidden py-48">
        <motion.div
          style={{
            opacity: finalOpacity,
            scale: finalScale,
            y: finalY
          }}
          className="relative flex flex-col items-center justify-center px-6 z-10"
        >


          {/* Secondary glow layer - tighter around button */}
          <div
            className="absolute left-1/2 pointer-events-none"
            style={{
              bottom: '50%',
              transform: 'translateX(-50%)',
              width: '1600px',
              height: '800px',
              borderRadius: '50% 50% 0 0',
              background: 'radial-gradient(ellipse 800px 400px at 50% 0%, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.15) 40%, transparent 70%)',
              filter: 'blur(60px)',
              opacity: 0.8,
            }}
          />


          {/* Glassmorphic Get Started Button - Larger Size */}
          <button
            className="relative group px-16 py-5 rounded-full text-4xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
            }}
          >


            {/* Get Started Button */}
            <Link href="auth/signup" className="relative z-10">

              Get Started →

            </Link>

          </button>
          <div className="mt-8 flex gap-4 justify-center text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center text-emerald-400 shadow-sm border border-emerald-500/20">1</div>
              <span>Sign Up</span>
            </div>
            <div className="text-slate-600">→</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 shadow-sm border border-blue-500/20">2</div>
              <span>Build Profile</span>
            </div>
            <div className="text-slate-600">→</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center text-emerald-400 shadow-sm border border-emerald-500/20">✓</div>
              <span>Get Started</span>
            </div>
          </div>
        </motion.div>

        {/* Background dots for final section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default GetStarted;