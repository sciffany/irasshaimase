"use client";

import Image from "next/image";

interface TitleScreenProps {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6'>
      {/* Main Content */}
      <div className='text-center space-y-8 max-w-2xl'>
        {/* App Title */}
        <div className='space-y-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-800 mb-2'>
            Irashaimase
          </h1>
          <p className='text-lg md:text-xl text-gray-600 mb-4'>
            いらっしゃいませ
          </p>
          <p className='text-sm text-gray-500'>(Welcome to our restaurant)</p>
        </div>

        {/* Character Image */}
        <div className='flex justify-center'>
          <div className='relative w-48 h-48 md:w-64 md:h-64'>
            <Image
              src='/job_waiter.png'
              alt='Waiter character'
              width={256}
              height={256}
              className='w-full h-full object-contain'
              priority
            />
          </div>
        </div>

        {/* Description */}
        <div className='space-y-4'>
          <h2 className='text-2xl md:text-3xl font-semibold text-gray-700'>
            Learn Japanese Restaurant Conversation
          </h2>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className='w-full max-w-md mx-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl'
        >
          <span className='text-lg'>Start Learning</span>
        </button>
      </div>

      {/* Footer */}
      <div className='mt-12 text-center text-sm text-gray-500'>
        <p>Practice Japanese conversation in a restaurant setting</p>
      </div>
    </div>
  );
}
