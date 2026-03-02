//src/app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import StackingCards from '@/components/stacking-cards/stacking-cards';
import { Users, Search, MessageCircle, Sparkles, Target, Zap, ArrowRight, Github, Linkedin, Globe, Menu, X, CheckCircle, Shield, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import HowColabreyWorks from '@/components/howcolabreyworks/howcolabreyworks';
import { GetStarted } from '@/components/getstarted/getstarted';
import { motion } from 'framer-motion';


export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToFeatures = () => {
    if (!featuresRef.current) return;
    const yOffset = -80; // adjust according to nav height
    const y = featuresRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'auto' });
    setMobileMenuOpen(false);
  };

  const scrollToHowItWorks = () => {
    if (!howItWorksRef.current) return;
    const yOffset = -80;
    const y = howItWorksRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'auto' });
    setMobileMenuOpen(false);
  };


  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white cursor-default">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black text-white">

        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group"> {/* Remove layout classes from Link */}
              <div className="flex items-center space-x-3"> {/* Add inner div WITH layout classes */}
                <Image
                  src="/images/logo.png"
                  alt="Colabrey Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-2xl font-bold font-display tracking-tight text-white group-hover:text-[#FF6B35] transition-colors duration-300">
                  Colabrey
                </span>
              </div>
            </Link>


            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/auth/login">
                <Button variant="ghost" size="xl" className="text-white font-bold">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="outline" // Use outline variant
                  size="lg"         // Use a larger size for visual impact
                  className="
                    rounded-full      // Make it pill-shaped
                    border-[#FF6B35]  // Carrot orange border color
                    text-white        // White text color
                    bg-transparent    // Transparent background
                    hover:border-white // Optional: light orange fill on hover
                    hover:text-white     // Keep text white on hover
                    font-bold         // Make text bold
                    transition-all
                    px-8 py-3         // Adjust padding to make it wide and tall
                    flex items-center gap-2 // For icon alignment
                  "
                >
                  <span>Sign Up</span> {/* Text */}
                  <ArrowRight className="w-5 h-5" /> {/* Arrow icon */}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
              <Link href="/auth/login" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#FF6B35] hover:bg-[#e64d00f5] text-white">
                  Join Colabrey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>


            </div>
          )}
        </div>
      </nav>


      {/* Hero Section */}


      <section className="relative container mx-auto px-6 py-20 md:py-30">
        <div className="text-center px-6">

          {/* Background dots for hero */}

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(60)].map((_, i) => {
              const startLeft = Math.random() * 100;
              const startTop = Math.random() * 100;
              const driftX = (Math.random() - 0.5) * 40;   // random left/right movement
              const driftY = (Math.random() - 0.5) * 40;   // random up/down movement
              const baseOpacity = Math.random() * 0.6 + 0.4;
              const size = Math.random() * 2 + 1;          // random 1px–3px size
              const duration = Math.random() * 2 + 1.5;     // faster animation
              const delay = Math.random() * 1.5;

              return (
                <motion.div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${startLeft}%`,
                    top: `${startTop}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: baseOpacity,
                    filter: "blur(0.5px)",
                  }}
                  animate={{
                    x: driftX,
                    y: driftY,
                    opacity: [0, baseOpacity, 0],
                    scale: [1, 1.8, 1],
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>


          <h1 className="text-5xl md:text-7xl font-display font-normal leading-tight text-white max-w-5xl mx-auto">
            Find your circle.
            <span className="block mt-4">
              <span className="relative inline-block px-3 ">
                {/* Blue fade behind "Build" */}
                <span
                  className="absolute inset-0 rounded-md"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,80,255,0.45) 0%, rgba(0,80,255,0.25) 55%, rgba(0,80,255,0) 100%)",
                    filter: "blur(0.5px)",
                  }}
                ></span>

                <span className="relative z-10">Build something</span>
              </span>

              <span className="relative inline-block">
                <span className="relative z-10">big</span>

                {/* Sparkle top right */}
                <span className="absolute -top-0 -right-3 text-white text-2xl">✦</span>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mt-16 mb-10 leading-relaxed">
            Connect with students who share your interests. Build friendships, learn together,
            and grow your circle with meaningful connections.
          </p>




          {/* Glass Button */}
          <button
            className="relative group px-8 py-4 rounded-full text-xl font-semibold text-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 mt-16 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1.0px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <Link href="/auth/signup" className="relative z-10">
              Join Colabrey →
            </Link>
          </button>

        </div>
      </section>



      {/* --- Why Colabrey Section --- */}
      {/* This section provides the overall container and scrollable height */}
      <section ref={featuresRef} className="relative">
        <StackingCards />
      </section>
      {/* --- End of Why Colabrey Section --- */}

      <div className="scale-transition"></div>

      {/*How Colabrey works*/}
      <section ref={howItWorksRef} className="relative">
        <HowColabreyWorks />
      </section>

      {/*Get started in minutes*/}
      <section className="relative">
        <GetStarted />
      </section>




      {/* Footer - IN FRAME */}
      <footer className="container mx-auto px-6 pb-10 ">
        <div className="glass rounded-3xl p-6 md:p-8">

          {/* Top Section */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">

            {/* Logo & Description */}
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="group">
                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/logo.png"
                    alt="Colabrey Logo"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <span className="text-2xl font-bold font-display tracking-tight text-white transition-colors">
                    Colabrey
                  </span>
                </div>
              </Link>

              <p className="text-base text-gray-400 leading-relaxed max-w-md pt-2">
                Connect with like-minded students, build communities, and create amazing things together.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={scrollToFeatures}
                    className="text-gray-400 hover:text-[#35eeff] transition-colors text-base"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={scrollToHowItWorks}
                    className="text-gray-400 hover:text-[#35eeff] transition-colors text-base"
                  >
                    How It Works
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    scroll={true}
                    className="text-gray-400 hover:text-[#35eeff] transition-colors text-base"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    scroll={true}
                    className="text-gray-400 hover:text-[#35eeff] transition-colors text-base"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-5">

            <p className="text-sm md:text-base text-gray-500">
              © 2024 Colabrey. Built by Team Pinky 🚀
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all group"
              >
                <Github className="w-5 h-5 group-hover:text-[#FF6B35]" />
              </a>

              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all group"
              >
                <Linkedin className="w-5 h-5 group-hover:text-[#a735ff]" />
              </a>

              <a
                href="https://your-website.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all group"
              >
                <Globe className="w-5 h-5 group-hover:text-[#359aff]" />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
