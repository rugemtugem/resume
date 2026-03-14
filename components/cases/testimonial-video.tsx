"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface TestimonialVideoProps {
  videoUrl: string;
  thumbnail: string;
  author: string;
  role: string;
  quote: string;
}

export function TestimonialVideo({ 
  videoUrl, 
  thumbnail, 
  author, 
  role,
  quote 
}: TestimonialVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative group mb-8">
      {/* Thumbnail */}
      {!isPlaying && (
        <div 
          className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-[var(--border-color)] group-hover:border-[var(--primary-color)] transition-colors aspect-[16/9] w-full"
          onClick={() => setIsPlaying(true)}
        >
          <Image
            src={thumbnail}
            alt={`Depoimento ${author}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center 
                          justify-center group-hover:bg-black/50 transition-all">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center 
                            justify-center group-hover:scale-110 transition-transform shadow-2xl">
              <Play className="w-6 h-6 md:w-8 md:h-8 text-[var(--primary-color)] ml-1" />
            </div>
          </div>

          {/* Quote Preview */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 
                          bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <p className="text-white italic mb-2 text-sm md:text-base leading-snug">"{quote}"</p>
            <p className="text-white/80 text-xs md:text-sm font-semibold">
              {author}, {role}
            </p>
          </div>
        </div>
      )}

      {/* Video Player */}
      {isPlaying && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--primary-color)] aspect-[16/9] w-full bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
