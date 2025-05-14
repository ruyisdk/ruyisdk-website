import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";
import "react-slideshow-image/dist/styles.css";

// Card sizes enum
const CardSizes = {
  L: "large",   // full width, 2x height
  M: "medium",  // full width, 1x height 
  S: "small",   // half width, 1x height
};

// Card data with content field, custom colors, sizes, and blur option
const slideImages = [
  {
    title: <Translate>嘉楠勘智K230D</Translate>,
    subtitle: <Translate>首款基于新32位 RuyiSDK 的AIoT量产芯片</Translate>,
    content: "嘉楠勘智K230D是首款采用RuyiSDK支持的32位RISC-V商用芯片，专为AIoT应用场景设计。这款芯片集成了高性能CPU核心、专用AI加速引擎和丰富的外设接口，能够满足各种智能设备的需求。\n\n作为RuyiSDK生态系统的重要组成部分，K230D芯片不仅提供了出色的性能和能效比，还通过与RuyiSDK的紧密集成，大大简化了开发流程，使开发者能够快速将创新想法转化为实际产品。K230D的推出标志着RISC-V架构在商业应用领域的重要突破，为未来更多基于RISC-V的创新产品铺平了道路。",
    Image: "https://www.kendryte.com/img/production/k230d_main.webp",
    Links: "/blog/2024/07/30/k230d",
    titleColor: "#ffffff",         // Custom title color (white)
    subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
    size: CardSizes.S,             // Small card (half width, 1x height)
    isBlur: false,                 // No blur on background
  },
  {
    title: <Translate>RuyiSDK IDE</Translate>,
    subtitle: <Translate>下载RuyiSDK IDE</Translate>,
    content: "RuyiSDK IDE 是一款基于开源软件 Eclipse 开发的、图形化的、主要面向 RISC-V 开发者的集成开发环境。该工具在继承 Eclipse 对嵌入式开发支持的基础上，计划逐步集成多款主流RISC-V开发板的 SDK，使得 RISC-V 开发更加便捷。",
    Image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Links: "https://mirror.iscas.ac.cn/ruyisdk/ide/",
    titleColor: "#ffffff",         // Custom title color (white)
    subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
    size: CardSizes.S,             // Small card (half width, 1x height)
    isBlur: false,                  // Apply blur effect to background
  },
];

export default function SlideNews() {
  // Define state variables
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Handle ESC key to close expanded card
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && expandedCardIndex !== null) {
        setExpandedCardIndex(null);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleEscKey);
      return () => window.removeEventListener('keydown', handleEscKey);
    }
  }, [expandedCardIndex]);

  // Handle body scroll lock when card is expanded
  useEffect(() => {
    if (expandedCardIndex !== null && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    } else if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [expandedCardIndex]);

  // Layout logic for responsive design and grouping small cards
  const organizeCards = () => {
    const isMobile = windowSize.width < 768;
    let result = [];
    let currentSmallCards = [];
    
    // Process all cards
    slideImages.forEach((card, index) => {
      // On mobile, all cards are full width
      if (isMobile) {
        result.push({
          ...card,
          layoutClass: styles.mobileCard,
          index
        });
        return;
      }
      
      // On desktop, handle according to size
      switch (card.size) {
        case CardSizes.L:
          // Before adding a large card, flush any pending small cards
          if (currentSmallCards.length > 0) {
            result.push({
              type: 'smallRow',
              cards: [...currentSmallCards]
            });
            currentSmallCards = [];
          }
          result.push({
            ...card,
            layoutClass: styles.cardLarge,
            index
          });
          break;
          
        case CardSizes.M:
          // Before adding a medium card, flush any pending small cards
          if (currentSmallCards.length > 0) {
            result.push({
              type: 'smallRow',
              cards: [...currentSmallCards]
            });
            currentSmallCards = [];
          }
          result.push({
            ...card,
            layoutClass: styles.cardMedium,
            index
          });
          break;
          
        case CardSizes.S:
          // Collect small cards
          currentSmallCards.push({
            ...card,
            layoutClass: styles.cardSmall,
            index
          });
          
          // If we have 2 small cards, add them as a row
          if (currentSmallCards.length === 2) {
            result.push({
              type: 'smallRow',
              cards: [...currentSmallCards]
            });
            currentSmallCards = [];
          }
          break;
          
        default:
          // Treat as medium if size not specified
          if (currentSmallCards.length > 0) {
            result.push({
              type: 'smallRow',
              cards: [...currentSmallCards]
            });
            currentSmallCards = [];
          }
          result.push({
            ...card,
            layoutClass: styles.cardMedium,
            index
          });
      }
    });
    
    // Add any remaining small cards
    if (currentSmallCards.length > 0) {
      result.push({
        type: 'smallRow',
        cards: [...currentSmallCards]
      });
    }
    
    return result;
  };

  const organizedCards = organizeCards();

  // Handler for card click
  const handleCardClick = (index, event) => {
    // Prevent expanding if clicked on a link
    if (event.target.tagName === 'A' || 
        event.target.parentElement.tagName === 'A') {
      return;
    }
    setExpandedCardIndex(index);
  };

  // Handler for closing expanded card
  const handleCloseExpandedCard = () => {
    setExpandedCardIndex(null);
  };

  // Handler for overlay click
  const handleOverlayClick = (event) => {
    if (event.target.classList.contains(styles.expandedCardOverlay)) {
      setExpandedCardIndex(null);
    }
  };

  // Render a single card
  const renderCard = (card) => {
    // Create the correct card background classes based on blur setting
    const backgroundClassName = card.isBlur 
      ? `${styles.slideBackground} ${styles.blurredBackground}`
      : styles.slideBackground;

    return (
      <div 
        key={card.index} 
        className={`${card.layoutClass} ${styles.clickableCard}`}
        onClick={(e) => handleCardClick(card.index, e)}
      >
        <div
          className={backgroundClassName}
          style={{
            backgroundImage: `url(${card.Image})`,
          }}
        />
        
        <div className={styles.content}>
          <h1 
            className={styles.title}
            style={{
              color: card.titleColor || "#ffffff",
            }}
          >
            {card.title}
          </h1>
          <h2 
            className={styles.subtitle}
            style={{
              color: card.subtitleColor || "#f0f0f0",
            }}
          >
            {card.subtitle}
          </h2>
          <div className={styles.buttonContainer}>
            <a href={card.Links} className={styles.primaryButton}>
              <Translate id="homepage.primarybutton">了解更多</Translate>
            </a>
            {card.subLinks && (
              <a
                href={card.subLinks}
                className={styles.secondaryButton}
              >
                <Translate id="homepage.secondarybutton">
                  现在开始
                </Translate>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.verticalSlideContainer}>
        {organizedCards.map((item, i) => {
          // For regular cards
          if (!item.type) {
            return renderCard(item);
          }
          
          // For rows of small cards
          if (item.type === 'smallRow') {
            return (
              <div key={`row-${i}`} className={styles.smallCardsRow}>
                {item.cards.map(card => renderCard(card))}
              </div>
            );
          }
          
          return null;
        })}
      </div>

      {/* Expanded Card Modal */}
      {expandedCardIndex !== null && (
        <div 
          className={styles.expandedCardOverlay}
          onClick={handleOverlayClick}
        >
          <div className={styles.expandedCard}>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseExpandedCard}
              aria-label="Close"
            >
              ×
            </button>
            
            <div 
              className={styles.expandedCardBackground}
              style={{
                backgroundImage: `url(${slideImages[expandedCardIndex].Image})`,
              }}
            />
            
            <div className={styles.expandedCardContent}>
              <h1 className={styles.expandedCardTitle}>
                {slideImages[expandedCardIndex].title}
              </h1>
              
              <h2 className={styles.expandedCardSubtitle}>
                {slideImages[expandedCardIndex].subtitle}
              </h2>
              
              {slideImages[expandedCardIndex].content && (
                <div className={styles.expandedCardDescription}>
                  {slideImages[expandedCardIndex].content.split('\n\n').map((paragraph, i) => (
                    <p key={i}><Translate>{paragraph}</Translate></p>
                  ))}
                </div>
              )}
              
              <div className={styles.expandedCardButtons}>
                <a 
                  href={slideImages[expandedCardIndex].Links} 
                  className={styles.primaryButton}
                >
                  <Translate id="homepage.primarybutton">了解更多</Translate>
                </a>
                {slideImages[expandedCardIndex].subLinks && (
                  <a
                    href={slideImages[expandedCardIndex].subLinks}
                    className={styles.secondaryButton}
                  >
                    <Translate id="homepage.secondarybutton">
                      现在开始
                    </Translate>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}