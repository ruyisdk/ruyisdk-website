import React, { useState, useEffect, useRef } from 'react';
import styles from './FlipCounter.module.css';

const CloudServerOutlined = () => (
  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
    <path d="M840 500H682c0-79.5-64.5-144-144-144s-144 64.5-144 144H236c-46.3 0-84 37.7-84 84v220c0 46.3 37.7 84 84 84h604c46.3 0 84-37.7 84-84V584c0-46.3-37.7-84-84-84zm-56 288H240V584h600v204zM538 212c-98.3 0-182 62.5-212.7 151.7 19.3 5.4 37.2 14.3 52.8 26.2C402.6 331 465 284 538 284c100.5 0 182 81.5 182 182 0 11.2-1 22.1-3 32.7 22.2 4.4 43 13 61.6 25 3.5-18.7 5.4-38 5.4-57.7 0-139.2-110.8-254-246-254z" />
  </svg>
);

const FlipDigit = ({ digit }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 300);
    }
  }, [digit, currentDigit]);

  return (
    <div className={styles.flipDigit}>
      <div className={`${styles.flipCard} ${isFlipping ? styles.flipping : ''}`}>
        <div className={styles.flipCardFront}>
          <span>{currentDigit}</span>
        </div>
        <div className={styles.flipCardBack}>
          <span>{digit}</span>
        </div>
      </div>
    </div>
  );
};

const FlipCounter = ({ value, title, icon: _icon, color, loading, standalone = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !loading && typeof value === 'number') {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value, loading]);

  const formatNumber = (num) => {
    return num.toString().padStart(6, '0');
  };

  const digits = formatNumber(displayValue).split('');

  if (standalone) {
    return (
      <div className={styles.standaloneContainer} ref={elementRef}>
        <div className={styles.flipCounter}>
          {digits.map((digit, index) => (
            <FlipDigit 
              key={index} 
              digit={parseInt(digit)} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.statCard} ref={elementRef} data-stat={title}>
      <div className={styles.statIcon} style={{ color }}>
        {<CloudServerOutlined />}
      </div>
      <div className={styles.statContent}>
        <h3 className={styles.statTitle}>{title}</h3>
        <div className={styles.statValue}>
          {loading ? (
            <div className={styles.loadingSkeleton}></div>
          ) : (
            <div className={styles.flipCounter}>
              {digits.map((digit, index) => (
                <FlipDigit 
                  key={index} 
                  digit={parseInt(digit)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipCounter; 