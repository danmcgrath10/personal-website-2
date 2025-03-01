import React from 'react';
import { TextGenerateEffect } from './ui/text-generate-effect';
import MagicButton from './MagicButton';
import { FaLocationArrow } from 'react-icons/fa';
import { Boxes } from './ui/background-boxes';

const Hero = React.memo(() => {
  return (
    <div className="h-full w-full pt-36 pb-64 relative overflow-hidden bg-black-100 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Welcome to my portfolio!
          </h2>
          <TextGenerateEffect
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
            words="Creating Software Solutions That Make an Impact"
          />
          <p className="text-center">
            Hi, I&apos;m a software engineer based in Boston, MA.
          </p>
          <a href="#experience">
            <MagicButton
              title="Check out my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
});

export default Hero;
