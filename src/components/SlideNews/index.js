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

// Card data with content field, custom colors, sizes, blur option, and ispopup attribute
const slideImages = [
  {
    title: <Translate>RuyiSDK IDE</Translate>,
    subtitle: <Translate>将 Ruyi 包管理器带到桌面环境</Translate>,
    content: "RuyiSDK IDE 是一款基于开源软件 Eclipse 开发的、图形化的、主要面向 RISC-V 开发者的集成开发环境。该工具在继承 Eclipse 对嵌入式开发支持的基础上，计划逐步集成多款主流RISC-V开发板的 SDK，使得 RISC-V 开发更加便捷。",
    Image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Links: "/docs/IDE/",
    ButtonText: "了解更多",        // 了解更多/立即跳转
    titleColor: "#ffffff",         // Custom title color (white)
    subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
    size: CardSizes.S,             // Small card (half width, 1x height)
    isBlur: false,                 // Apply blur effect to background
    ispopup: false,                // Enable click-to-show-popup for this card
  },
  {
    title: <Translate>RevyOS</Translate>,
    subtitle: <Translate>针对 XuanTie 生态芯片优化的 Debian 发行版</Translate>,
    content: "How you went there as there's no popup?",
    Image: "img/RevyOS-logo.svg",
    Links: "https://docs.revyos.dev/",
    ButtonText: "立即跳转",
    titleColor: "#ffffff",         // Custom title color (white)
    subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
    size: CardSizes.S,             // Small card (half width, 1x height)
    isBlur: true,                  // Enable blur on background
    ispopup: false,                // Disable click-to-show-popup for this card
  },
  {
    title: <Translate>Support Matrix</Translate>,
    subtitle: <Translate>RISC-V 开发板与操作系统支持矩阵</Translate>,
    content: "How you went there as there's no popup?",
    Image: "img/ruyi-logo-720.svg",
    Links: "https://matrix.ruyisdk.org/",
    ButtonText: "立即跳转",
    titleColor: "#ffffff",         // Custom title color (white)
    subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
    size: CardSizes.S,             // Small card (half width, 1x height)
    isBlur: true,                  // Enable blur on background
    ispopup: false,                // Disable click-to-show-popup for this card
  },
  {
    title: <Translate>荔枝派 4A</Translate>,
    subtitle: <Translate>荔枝派 4A 软件生态已并入 RuyiSDK 项目</Translate>,
    content: "矽速科技（Sipeed）与PLCT实验室联合宣布，RuyiSDK 将作为 LicheePi 4A 开发板的上游支持平台，承担后续的系统维护、升级和软件支持工作。这不仅推动了 RISC-V 开发板的发展与广泛应用，还为开发者提供一个更加便捷高效的开发环境。当前 RevyOS 的 LicheePi 4A 版本已经更新到 20250420。",
    Image: "img/licheepi-4a.png",
    Links: "https://mirror.iscas.ac.cn/revyos/extra/images/lpi4a/20250420/",
    ButtonText: "了解更多",
    titleColor: "#ffffff",         // Custom title color (white)
    subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
    size: CardSizes.S,             // Small card (half width, 1x height)
    isBlur: false,                 // Enable blur on background
    ispopup: true,                 // Enable click-to-show-popup for this card
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

  // Handler for card click - only process popup if ispopup is true
  const handleCardClick = (index, event) => {
    // Prevent expanding if clicked on a link that should navigate away
    if (event.target.tagName === 'A' || 
        event.target.parentElement.tagName === 'A') {
      // Check if the link is inside a card that is NOT a popup trigger
      if (!slideImages[index].ispopup) {
          return;
      }
    }
    
    // Only show popup if ispopup is true
    if (slideImages[index].ispopup) {
      setExpandedCardIndex(index);
    }
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

    // Determine if card should have clickable styling
    const cardClassName = card.ispopup 
      ? `${card.layoutClass} ${styles.clickableCard}`
      : card.layoutClass;

    return (
      <div 
        key={card.index} 
        className={cardClassName}
        onClick={(e) => handleCardClick(card.index, e)}
        style={{
          cursor: card.ispopup ? 'pointer' : 'default'
        }}
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
            {card.ispopup ? (
              <button className={styles.primaryButton}>
                <Translate>显示详情</Translate>
              </button>
            ) : (
              <a target="_blank" href={card.Links} className={styles.primaryButton} rel="noopener noreferrer">
                <Translate id="homepage.primarybutton">{card.ButtonText}</Translate>
              </a>
            )}
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
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Translate id="homepage.primarybutton">{slideImages[expandedCardIndex].ButtonText}</Translate>
                </a>
                {slideImages[expandedCardIndex].subLinks && (
                  <a
                    href={slideImages[expandedCardIndex].subLinks}
                    className={styles.secondaryButton}
                    target="_blank"
                    rel="noopener noreferrer"
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
