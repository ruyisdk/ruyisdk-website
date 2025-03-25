import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'antd';

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const scrollLock = useRef(false);
  const buttonRef = useRef();

  const checkScreenSize = () => {
    setIsVisible(window.innerWidth < 1024);
  };

  const scrollDown = useCallback(() => {
    window.scrollBy({
      top: window.innerHeight * 1.05,
      behavior: 'smooth'
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (buttonRef.current) {
      const { top } = buttonRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - scrollY;
      if (delta > 2 && !scrollLock.current && top > -20) {
        scrollLock.current = true;

        scrollDown();

        setTimeout(() => {
          scrollLock.current = false;
        }, 800);

        document.documentElement.style.overflowY = 'hidden';
        setTimeout(() => {
          document.documentElement.style.overflowY = 'auto';
        }, 500);
      }
      setScrollY(currentScrollY);
    }

  }, [scrollY, scrollDown]);

  useEffect(() => {
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (!isVisible) return null;

  return (
    <Button
      ref={buttonRef}
      onClick={scrollDown}
      type='primary'
      shape='round'
      style={{
        position: 'absolute',
        bottom: '50px',
        right: '20px',
      }}
    >
      继续探索 ▼
    </Button>
  );
};

export default ScrollButton;