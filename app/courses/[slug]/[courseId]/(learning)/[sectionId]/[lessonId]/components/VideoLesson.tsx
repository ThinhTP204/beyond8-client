'use client'

import React, { useEffect, useState } from 'react'
import {
  MediaPlayer,
  MediaProvider,
  TimeSlider,
  PlayButton,
  FullscreenButton,
  Controls,
  useMediaState
} from '@vidstack/react'
import '@vidstack/react/player/styles/base.css'
import { 
  Play, 
  Pause, 
  Maximize, 
  Minimize, 
} from 'lucide-react'

// Custom Play Button Component with Animation
function CustomPlayButton() {
  const isPaused = useMediaState('paused')
  return (
    <PlayButton className="group relative flex items-center justify-center p-2 outline-none ring-inset ring-brand-purple focus-visible:ring-4 rounded-md">
       {isPaused ? (
          <Play className="w-8 h-8 fill-white text-white transition-transform group-hover:scale-110" />
       ) : (
          <Pause className="w-8 h-8 fill-white text-white transition-transform group-hover:scale-110" />
       )}
    </PlayButton>
  )
}

// Center Large Play Button
function CenterPlayButton() {
  const isPaused = useMediaState('paused')
  const hasStarted = useMediaState('started')
  
  if (!isPaused && hasStarted) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-in fade-in zoom-in duration-300 pointer-events-auto cursor-pointer hover:scale-110 transition-transform hover:bg-white/20">
         <PlayButton className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8 fill-white text-white ml-1" />
         </PlayButton>
      </div>
    </div>
  )
}

function CustomFullscreenButton() {
  const isFullscreen = useMediaState('fullscreen')
  return (
     <FullscreenButton className="group p-2 hover:bg-white/10 rounded-md transition-colors">
        {isFullscreen ? (
           <Minimize className="w-5 h-5 text-white/90 group-hover:text-white" />
        ) : (
           <Maximize className="w-5 h-5 text-white/90 group-hover:text-white" />
        )}
     </FullscreenButton>
  )
}

interface VideoLessonProps {
  title: string
  videoUrl?: string
}

export default function VideoLesson({ title, videoUrl }: VideoLessonProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    //eslint-disable-next-line
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full aspect-video bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-white/30 font-medium">Loading Player...</div>
      </div>
    )
  }

  const finalUrl = videoUrl || "https://d30z0qh7rhzgt8.cloudfront.net/courses/hls/meo_con_lon_ton/meo_con_lon_ton_1080p.m3u8"

  return (
    <div className="w-full mb-8 group relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black aspect-video">
      <MediaPlayer 
        title={title}
        src={finalUrl}
        playsInline
        aspectRatio="16/9"
        load="eager"
        className="w-full h-full"
      >
        <MediaProvider />
        
        {/* Center Play Button Overlay */}
        <CenterPlayButton />

        {/* Pro Max Controls Overlay */}
        <Controls.Root className="absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 data-[visible]:opacity-100 pointer-events-none">
           
           <div className="p-4 md:p-6 w-full space-y-4 pointer-events-auto">
              
              {/* Progress Bar (TimeSlider) */}
              <TimeSlider.Root className="group/slider relative flex items-center select-none touch-none w-full h-4 cursor-pointer">
                 <TimeSlider.Track className="relative ring-brand-purple bg-white/20 rounded-full w-full h-1 group-hover/slider:h-2 transition-all duration-300">
                    <TimeSlider.TrackFill className="bg-brand-gradient absolute h-full rounded-full will-change-[width]" />
                    <TimeSlider.Progress className="bg-white/30 absolute h-full rounded-full will-change-[width]" />
                 </TimeSlider.Track>
                 <TimeSlider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg ring-2 ring-brand-purple opacity-0 group-hover/slider:opacity-100 transition-opacity transform scale-0 group-hover/slider:scale-100 transition-transform duration-200" />
                 {/* Preview implementation would go here if thumbnails available */}
              </TimeSlider.Root>

              {/* Bottom Bar: Play | Volume | Spacer | Title | Settings | Fullscreen */}
              <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <CustomPlayButton />

                    <div className="hidden md:block">
                        <h3 className="text-white text-sm font-medium line-clamp-1 max-w-[200px]">{title}</h3>
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    
                    <CustomFullscreenButton />
                 </div>
              </div>
           </div>

        </Controls.Root>
      </MediaPlayer>
    </div>
  )
}
