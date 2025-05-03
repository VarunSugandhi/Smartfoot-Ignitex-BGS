
import React from 'react';

const FloatingCityBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Abstract geometric shapes */}
      <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-primary/10 animate-float"></div>
      <div className="absolute top-[20%] right-[15%] w-48 h-48 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-[30%] left-[20%] w-24 h-24 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Building-like shapes */}
      <div className="absolute bottom-[10%] left-[30%] w-16 h-48 bg-primary/5 rounded-t-lg animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-[10%] left-[36%] w-10 h-32 bg-primary/10 rounded-t-lg animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-[10%] left-[42%] w-14 h-40 bg-primary/15 rounded-t-lg animate-float" style={{ animationDelay: '2.5s' }}></div>
      
      {/* Right side buildings */}
      <div className="absolute bottom-[10%] right-[30%] w-12 h-52 bg-primary/5 rounded-t-lg animate-float" style={{ animationDelay: '0.7s' }}></div>
      <div className="absolute bottom-[10%] right-[36%] w-16 h-36 bg-primary/10 rounded-t-lg animate-float" style={{ animationDelay: '1.7s' }}></div>
      <div className="absolute bottom-[10%] right-[42%] w-10 h-44 bg-primary/15 rounded-t-lg animate-float" style={{ animationDelay: '2.7s' }}></div>
      
      {/* Connecting lines */}
      <div className="absolute top-[30%] left-[30%] w-[40%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute top-[50%] left-[20%] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute top-[70%] left-[10%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </div>
  );
};

export default FloatingCityBackground;
