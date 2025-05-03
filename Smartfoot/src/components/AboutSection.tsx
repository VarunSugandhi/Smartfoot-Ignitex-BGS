
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  step: string;
  title: string;
  description: string;
  isLeft?: boolean;
  delay?: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  step,
  title,
  description,
  isLeft = true,
  delay = 0
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('opacity-100', 'translate-y-0');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={itemRef}
      className={cn(
        "flex mb-8 opacity-0 translate-y-8 transition-all duration-700 ease-out",
        isLeft ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className={cn(
        "flex flex-col items-center w-10",
        isLeft ? "mr-4" : "ml-4"
      )}>
        <div className="bg-primary rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
          {step}
        </div>
        <div className="h-full w-1 bg-primary/20 mt-2"></div>
      </div>
      <div className={cn(
        "glass-card rounded-lg p-6 flex-1",
        isLeft ? "text-left" : "text-right"
      )}>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Background floating shapes */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-10 left-1/3 w-20 h-20 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About SMARTFOOT
          </h2>
          <p className="text-lg text-primary font-semibold max-w-2xl mx-auto">
            Building smarter urban mobility — free, safe, community-driven.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <TimelineItem
            step="1"
            title="The Problem"
            description="Urban areas face challenges with crowded, unsafe routes and disconnected communities, making city navigation increasingly difficult."
            isLeft={true}
            delay={100}
          />
          
          <TimelineItem
            step="2"
            title="Our Solution"
            description="SMARTFOOT combines AI-powered route planning with community-driven safety features to create a smarter way to navigate urban environments."
            isLeft={false}
            delay={300}
          />
          
          <TimelineItem
            step="3"
            title="The Impact"
            description="By creating safer paths, connecting communities through shared activities, and enabling civic engagement, we're making cities more livable for everyone."
            isLeft={true}
            delay={500}
          />
          
          <div className="text-center mt-16 bg-primary/10 rounded-xl p-6 animate-pulse">
            <h3 className="text-xl font-bold mb-2">Our Promise</h3>
            <p className="text-lg">SMARTFOOT is and will always be <span className="text-primary font-bold">100% FREE</span> for all users.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
