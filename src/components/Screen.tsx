"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { tree } from "@/app/tree";

interface ScreenProps {
  screenKey: keyof typeof tree;
  onNavigate: (nextKey: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
  onBackToTitle?: () => void;
}

export default function Screen({
  screenKey,
  onNavigate,
  onBack,
  canGoBack,
  onBackToTitle,
}: ScreenProps) {
  const screenData = tree[screenKey];
  const [selectedOption, setSelectedOption] = useState<{
    user: string;
    japanese: string;
    romaji: string;
    next?: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Check if this is an animation screen (no Japanese text, has animation)
  const isAnimationScreen = screenData.animation && !screenData.japanese;

  // Automatically play audio when screen changes
  useEffect(() => {
    if (screenData?.japanese) {
      // Small delay to ensure the screen has rendered
      const timer = setTimeout(() => {
        handleTextToSpeech(screenData.japanese!);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [screenKey, screenData?.japanese]); // Trigger when screenKey or japanese text changes

  // Auto-advance animation screens after 3 seconds (only if comp text exists)
  useEffect(() => {
    if (isAnimationScreen && screenData?.next && screenData?.comp) {
      const timer = setTimeout(() => {
        onNavigate(screenData.next!);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isAnimationScreen, screenData?.next, screenData?.comp, onNavigate]);

  // Animate progress bar for animation screens (only if comp text exists)
  useEffect(() => {
    if (isAnimationScreen && screenData?.comp) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30); // Update every 30ms for smooth animation

      return () => clearInterval(interval);
    }
  }, [isAnimationScreen, screenData?.comp, screenKey]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };

    if (showSettingsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettingsMenu]);

  if (!screenData) {
    return <div>Screen not found</div>;
  }

  const handleOptionClick = (option: {
    user?: string;
    japanese?: string;
    romaji?: string;
    next?: string;
  }) => {
    setSelectedOption(
      option as {
        user: string;
        japanese: string;
        romaji: string;
        next?: string;
      }
    );
    // Automatically play audio when option is selected
    if (option.japanese) {
      handleTextToSpeech(option.japanese);
    }
  };

  const handleNext = () => {
    if (selectedOption?.next) {
      onNavigate(selectedOption.next);
    }
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      setIsPlaying(true);

      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsPlaying(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  // Helper function to highlight bracketed words in bold (without showing brackets)
  const highlightBrackets = (text: string) => {
    return text.split(/(\[.*?\])/).map((part, index) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        // Remove the brackets and make the content bold
        const content = part.slice(1, -1); // Remove first and last character (brackets)
        return (
          <span key={index} className='font-black'>
            {content}
          </span>
        );
      }
      return part;
    });
  };

  // Animation screen layout
  if (isAnimationScreen) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col'>
        {/* Settings Gear Button */}
        <div className='absolute top-4 right-4 z-10' ref={menuRef}>
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className='p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200'
            title='Settings'
          >
            <svg
              className='w-6 h-6 text-black'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </button>

          {/* Settings Menu */}
          {showSettingsMenu && (
            <div className='absolute top-12 right-0 bg-white rounded-lg shadow-xl border min-w-48 py-2'>
              <button
                onClick={() => {
                  setShowSettingsMenu(false);
                  onBackToTitle?.();
                }}
                className='w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3'
              >
                <svg
                  className='w-5 h-5 text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
                <span>Back to Title Screen</span>
              </button>
            </div>
          )}
        </div>

        {/* Animation Content */}
        <div className='flex-1 flex flex-col items-center justify-center p-6'>
          <div className='text-center space-y-6'>
            {/* Animation GIF */}
            <div className='flex justify-center'>
              <Image
                src={`/${screenData.animation}`}
                alt='Animation'
                width={300}
                height={300}
                className='w-64 h-64 md:w-80 md:h-80 object-contain'
                priority
              />
            </div>

            {/* Comp Text */}
            {screenData.comp && (
              <div className='text-center'>
                <h2 className='text-gray-600 text-lg md:text-xl'>
                  {highlightBrackets(screenData.comp)}
                </h2>
              </div>
            )}

            {/* Progress Bar - only show if comp text exists */}
            {screenData.comp && (
              <div className='w-full max-w-md mx-auto'>
                <div className='bg-gray-200 rounded-full h-2 overflow-hidden'>
                  <div
                    className='bg-blue-500 h-full rounded-full transition-all duration-75 ease-out'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons for Animation Screen */}
        <div className='bg-white rounded-t-3xl shadow-lg p-6'>
          <div className='flex gap-3'>
            {canGoBack && onBack && (
              <button
                onClick={onBack}
                className='flex-1 p-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium'
              >
                ← Back
              </button>
            )}
            {screenData.back_to_home && onBackToTitle && (
              <button
                onClick={onBackToTitle}
                className='flex-1 p-3 rounded-xl border-2 border-green-500 bg-green-500 text-white hover:bg-green-600 transition-all duration-200 font-medium'
              >
                🏠 Home
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col'>
      {/* Settings Gear Button */}
      <div className='absolute top-4 right-4 z-10' ref={menuRef}>
        <button
          onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          className='p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200'
          title='Settings'
        >
          <svg
            className='w-6 h-6 text-black'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
        </button>

        {/* Settings Menu */}
        {showSettingsMenu && (
          <div className='absolute top-12 right-0 bg-white rounded-lg shadow-xl border min-w-48 py-2'>
            <button
              onClick={() => {
                setShowSettingsMenu(false);
                onBackToTitle?.();
              }}
              className='w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3'
            >
              <svg
                className='w-5 h-5 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
              <span>Back to Title Screen</span>
            </button>
          </div>
        )}
      </div>

      {/* Top Section - Character Photo */}
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='relative w-48 h-48 md:w-56 md:h-56'>
          {/* Waiter character image - full display */}
          <Image
            src='/job_waiter.png'
            alt='Waiter character'
            width={224}
            height={224}
            className='w-full h-full object-contain'
            priority
          />
        </div>
      </div>

      {/* Bottom Section - Text and Options */}
      <div className='bg-white rounded-t-3xl shadow-lg p-6 space-y-6'>
        <div className='text-center'>
          <div className='flex items-center justify-center gap-3 mb-1'>
            {/* <h2 className='text-lg md:text-xl font-medium text-gray-600'>
              {highlightBrackets(screenData.japanese)}
            </h2> */}
            {screenData.japanese && screenData.comp && (
              <button
                onClick={() =>
                  screenData.japanese && handleTextToSpeech(screenData.japanese)
                }
                disabled={isPlaying || !screenData.japanese}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isPlaying
                    ? "bg-blue-100 text-blue-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
                }`}
                title='Play audio'
              >
                {isPlaying ? (
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
          <p className='text-sm text-black mb-2 text-xl md:text-2xl '>
            {screenData.romaji && highlightBrackets(screenData.romaji)}
          </p>
          <h2 className='text-gray-600 mb-2'>
            {screenData.comp && highlightBrackets(screenData.comp)}
          </h2>
        </div>

        {screenData.options && screenData.options.length > 0 && (
          <div className='space-y-3'>
            {screenData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedOption === option
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <div className='text-center'>
                  <div
                    className={`text-sm mb-1 ${
                      selectedOption === option ? "text-black" : "text-gray-600"
                    }`}
                  >
                    {/* {highlightBrackets(option.japanese)} */}
                  </div>
                  <div
                    className={`text-lg ${
                      selectedOption === option ? "text-black" : "text-black"
                    }`}
                  >
                    {option.romaji && highlightBrackets(option.romaji)}
                  </div>
                  <span
                    className={`text-sm ${
                      selectedOption === option ? "text-black" : "text-gray-600"
                    }`}
                  >
                    {option.user && highlightBrackets(option.user)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className='flex gap-3 mt-6'>
          {canGoBack && onBack && (
            <button
              onClick={onBack}
              className='flex-1 p-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium'
            >
              ← Back
            </button>
          )}
          {screenData.back_to_home && onBackToTitle && (
            <button
              onClick={onBackToTitle}
              className='flex-1 p-3 rounded-xl border-2 border-green-500 bg-green-500 text-white hover:bg-green-600 transition-all duration-200 font-medium'
            >
              🏠 Home
            </button>
          )}
          {/* Show Next button for screens with next property but no options */}
          {screenData.next &&
          (!screenData.options || screenData.options.length === 0) ? (
            <button
              onClick={() => onNavigate(screenData.next!)}
              className='flex-1 p-3 rounded-xl border-2 border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 font-medium'
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`flex-1 p-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                selectedOption
                  ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                  : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Hidden audio element for text-to-speech */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onError={() => setIsPlaying(false)}
      />
    </div>
  );
}
