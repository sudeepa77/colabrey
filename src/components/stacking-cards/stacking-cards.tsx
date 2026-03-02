import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function StackingCards() {
  return (
    <section className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950">
      <h2 className="relative z-0 text-[20vw] text-neutral-800 md:text-[200px]">
        Why Colabrey<span className="text-indigo-500">?</span>
      </h2>
      <Cards />
    </section>
  );
}

const Cards = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      <Card
        containerRef={containerRef}
        title="Smart Discovery"
        content="Find students with specific skills, interests, and like-minded people on Colbrey."
        rotate="6deg"
        top="20%"
        left="15%"
        className="w-64 h-56 md:w-80 md:h-64"
        bgColor="bg-emerald-300"
        textColor="text-neutral-900"
      />
      <Card
        containerRef={containerRef}
        title="Build Communities"
        content="Create groups, collaborate on projects, share knowledge and work together."
        rotate="-4deg"
        top="35%"
        left="45%"
        className="w-72 h-36 md:w-80 md:h-40"
        bgColor="bg-indigo-300"
        textColor="text-neutral-900"
      />
      <Card
        containerRef={containerRef}
        title="Connect Instantly"
        content="Start meaningful conversations with one-on-one messaging and build you networks."
        rotate="8deg"
        top="55%"
        left="25%"
        className="w-72 h-36 md:w-80 md:h-40"
        bgColor="bg-yellow-300"
        textColor="text-neutral-900"
      />
    </div>
  );
};

interface CardProps {
  containerRef: React.RefObject<HTMLDivElement>;
  title: string;
  content: string;
  top: string;
  left: string;
  rotate: string;
  className?: string;
  bgColor: string;
  textColor: string;
}

const Card = ({
  containerRef,
  title,
  content,
  top,
  left,
  rotate,
  className,
  bgColor,
  textColor,
}: CardProps) => {
  const [zIndex, setZIndex] = useState(0);

  const updateZIndex = () => {
    const els = document.querySelectorAll(".drag-elements");

    let maxZIndex = -Infinity;

    els.forEach((el) => {
      const zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );

      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });

    setZIndex(maxZIndex + 1);
  };

  return (
    <motion.div
      onMouseDown={updateZIndex}
      style={{
        top,
        left,
        rotate,
        zIndex,
      }}
      className={twMerge(
        "drag-elements absolute p-5 border-2 border-black cursor-grab active:cursor-grabbing flex flex-col justify-center",
        bgColor,
        textColor,
        className
      )}
      drag
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
    >
      <h3 className="mb-6 font-bold">{title}</h3>
      <p className="opacity-90 leading-relaxed">{content}</p>
    </motion.div>
  );
};
