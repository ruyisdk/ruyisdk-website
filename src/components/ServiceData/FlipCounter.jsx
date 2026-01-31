import React, { useState, useEffect, useRef } from 'react';
import { CloudServerOutlined } from '@ant-design/icons';
import './FlipCounter.css';

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
    <div className="flipDigit">
      <div className={`flipCard ${isFlipping ? 'flipping' : ''}`}>
        <div className="flipCardFront">
          <span>{currentDigit}</span>
        </div>
        <div className="flipCardBack">
          <span>{digit}</span>
        </div>
      </div>
    </div>
  );
};

const FlipCounter = ({ value, title, icon, color, loading, standalone = false }) => {
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
      <div className="standaloneContainer" ref={elementRef}>
        <div className="flipCounter">
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
    <div className="statCard" ref={elementRef} data-stat={title}>
      <div className="statIcon" style={{ color }}>
        {<CloudServerOutlined />}
      </div>
      <div className="statContent">
        <h3 className="statTitle">{title}</h3>
        <div className="statValue">
          {loading ? (
            <div className="loadingSkeleton"></div>
          ) : (
            <div className="flipCounter">
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