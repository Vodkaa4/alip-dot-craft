import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  pauseDuration?: number;
  className?: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  texts,
  speed = 80,
  pauseDuration = 1500,
  className = '',
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const text = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < text.length) {
          setCurrentText(text.substring(0, currentText.length + 1));
        } else {
          // Finished typing, pause then delete
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts, speed, pauseDuration]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {currentText}
      <span 
        className={`inline-block w-0.5 h-full bg-electric-blue ml-1 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-100`}
        style={{ height: '1em' }}
      >
        |
      </span>
    </span>
  );
};

export default TypingAnimation;