import React, { useState, useEffect } from "react";
import Translate, { translate } from "@docusaurus/Translate";
import "react-slideshow-image/dist/styles.css";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SectionContainer from '../../homepage/SectionContainer';

// Card sizes enum
const CardSizes = {
  L: "large",   // full width, 2x height
  M: "medium",  // full width, 1x height
  S: "small",   // half width, 1x height
};

export default function SlideNews() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale;
  const revyosLink = (locale === 'en' || locale === 'de') ? 'https://docs.revyos.dev/en' : 'https://docs.revyos.dev';
  // Define state variables
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });
  // New state for very wide screens
  const [isVeryWideScreen, setIsVeryWideScreen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWindowSize({
        width: currentWidth,
      });
      // Define your "very wide screen" breakpoint here, e.g., 1440px
      setIsVeryWideScreen(currentWidth >= 1440);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      // Call once initially to set the correct state
      handleResize();
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
      return undefined; // Add this return statement
    };
  }, [expandedCardIndex]);

  // Layout logic for responsive design and grouping small cards

  // Tailwind class mappings for card layouts and elements (component scope)
  const classes = {
    cardLarge: 'relative overflow-hidden flex items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full h-[480px]',
    cardMedium: 'relative overflow-hidden flex items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full h-[240px]',
    cardSmall: 'relative overflow-hidden flex items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-[calc(50%_-_0.5rem)] h-[240px] flex-none',
    mobileCard: 'relative overflow-hidden flex items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full h-[240px]',
    clickableCard: 'cursor-pointer',
    slideBackground: 'absolute inset-0 bg-cover bg-center z-0 bg-black/40 bg-blend-darken',
    blurredBackground: 'filter blur-[15px] scale-[1.05]',
    content: 'relative flex flex-col justify-center items-center text-center z-10 p-8 w-[85%]',
    title: 'text-2xl font-bold mb-4 tracking-tight text-white drop-shadow-md',
    subtitle: 'font-medium text-base mb-4 text-white drop-shadow-md',
    buttonContainer: 'flex gap-3 mt-4 flex-wrap justify-center',
    primaryButton: 'inline-flex items-center justify-center bg-[rgb(252,232,164)] text-[#002677] px-4 py-2 rounded-full font-semibold text-[0.9rem] min-w-[100px] shadow-sm transition-all duration-200 hover:bg-[rgb(242,222,154)] hover:-translate-y-0.5',
    secondaryButton: 'inline-flex items-center justify-center bg-[#F8F3E2] text-[#002677] px-4 py-2 rounded-full font-semibold text-[0.9rem] min-w-[100px] shadow-sm transition-all duration-200 hover:bg-[#E8E3D2] hover:-translate-y-0.5',
  };

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
          layoutClass: classes.mobileCard,
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
            layoutClass: classes.cardLarge,
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
            layoutClass: classes.cardMedium,
            index
          });
          break;

        case CardSizes.S:
          // Collect small cards
          currentSmallCards.push({
            ...card,
            layoutClass: classes.cardSmall,
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
            layoutClass: classes.cardMedium,
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

  const slideImages = [
    {
      title: <Translate>RuyiSDK IDE</Translate>,
      subtitle: <Translate>将 Ruyi 包管理器带到桌面环境</Translate>,
      content: "RuyiSDK IDE 是一款基于开源软件 Eclipse 开发的、图形化的、主要面向 RISC-V 开发者的集成开发环境。该工具在继承 Eclipse 对嵌入式开发支持的基础上，计划逐步集成多款主流RISC-V开发板的 SDK，使得 RISC-V 开发更加便捷。",
      Image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      Links: "/docs/IDE/",
      ButtonText: "了解更多",        // 了解更多/立即跳转
      titleColor: "#ffffff",        // Custom title color (white)
      subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
      size: CardSizes.S,            // Small card (half width, 1x height)
      isBlur: false,                // Apply blur effect to background
      ispopup: false,               // Disable click-to-show-popup for this card
    },
    {
      title: <Translate>RevyOS</Translate>,
      subtitle: <Translate>针对 XuanTie 生态芯片优化的 Debian 发行版</Translate>,
      content: "How you went there as there's no popup?",
      Image: "img/RevyOS-logo.svg",
      Links: revyosLink,
      ButtonText: "立即跳转",
      titleColor: "#ffffff",        // Custom title color (white)
      subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
      size: CardSizes.S,            // Small card (half width, 1x height)
      isBlur: true,                 // Enable blur on background
      ispopup: false,               // Disable click-to-show-popup for this card
    },
    {
      title: <Translate>Support Matrix</Translate>,
      subtitle: <Translate>RISC-V 开发板与操作系统支持矩阵</Translate>,
      content: "How you went there as there's no popup?",
      Image: "img/ruyi-logo-720.svg",
      Links: "https://matrix.ruyisdk.org/",
      ButtonText: "立即跳转",
      titleColor: "#ffffff",        // Custom title color (white)
      subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
      size: CardSizes.S,            // Small card (half width, 1x height)
      isBlur: true,                 // Enable blur on background
      ispopup: false,               // Disable click-to-show-popup for this card
    },
    {
      title: <Translate>荔枝派 4A</Translate>,
      subtitle: <Translate>荔枝派 4A 软件生态已并入 RuyiSDK 项目</Translate>,
      content: "RuyiSDK 将作为 LicheePi 4A 开发板的上游支持平台，承担后续的系统维护、升级和软件支持工作。这不仅推动了 RISC-V 开发板的发展与广泛应用，还为开发者提供一个更加便捷高效的开发环境。",
      Image: "img/licheepi-4a.png",
      Links: "https://mirror.iscas.ac.cn/revyos/extra/images/lpi4a/",
      ButtonText: "立即下载",
      titleColor: "#ffffff",        // Custom title color (white)
      subtitleColor: "#f0f0f0",      // Custom subtitle color (light)
      size: CardSizes.S,            // Small card (half width, 1x height)
      isBlur: false,                // Enable blur on background
      ispopup: true,                // Enable click-to-show-popup for this card
    },
  ];

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

  // Handler for overlay click - close only if clicking the overlay background
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setExpandedCardIndex(null);
    }
  };

  // Render a single card
  const renderCard = (card) => {
    // Create the correct card background classes based on blur setting
    const backgroundClassName = card.isBlur
      ? `${classes.slideBackground} ${classes.blurredBackground}`
      : classes.slideBackground;

    // Determine if card should have clickable styling
    const cardClassName = card.ispopup
      ? `${card.layoutClass} ${classes.clickableCard}`
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

        <div className={classes.content}>
          <h1
            className={classes.title}
            style={{
              color: card.titleColor || "#ffffff",
            }}
          >
            {card.title}
          </h1>
          <h2
            className={classes.subtitle}
            style={{
              color: card.subtitleColor || "#f0f0f0",
            }}
          >
            {card.subtitle}
          </h2>
          <div className={classes.buttonContainer}>
            {card.ispopup ? (
              <button className={classes.primaryButton}>
                <Translate>显示详情</Translate>
              </button>
            ) : (
              <a target="_blank" href={card.Links} className={classes.primaryButton} rel="noopener noreferrer">
                <Translate>{card.ButtonText}</Translate>
              </a>
            )}
            {card.subLinks && (
              <a
                href={card.subLinks}
                className={classes.secondaryButton}
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
      {/* Unified wrapper for the light grey background and width */}
      <SectionContainer>
        <div className={`flex flex-col gap-4 w-full relative`}>
          {organizedCards.map((item, i) => {
            // For regular cards
            if (!item.type) {
              return renderCard(item);
            }

            // For rows of small cards
            if (item.type === 'smallRow') {
              return (
                <div key={`row-${i}`} className="flex flex-wrap gap-4 w-full">
                  {item.cards.map(card => renderCard(card))}
                </div>
              );
            }

            return null;
          })}
        </div>
      </SectionContainer>

      {/* Expanded Card Modal */}
      {expandedCardIndex !== null && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-8 overflow-y-auto"
          onClick={handleOverlayClick}
        >
          <div className="flex flex-col relative w-[90%] max-w-[900px] max-h-[90vh] bg-white rounded-[10px] overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.15)]" ref={null}>
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 text-white text-2xl flex items-center justify-center z-10 backdrop-blur-sm"
              onClick={handleCloseExpandedCard}
              aria-label="Close"
            >
              ×
            </button>

            {/* New header element for the image */}
            <div
              className="relative h-[25vh] flex-shrink-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slideImages[expandedCardIndex].Image})`,
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content element is now a sibling to the header */}
            <div className="relative z-20 p-8 overflow-y-auto bg-white">
              <h1 className="text-[2.5rem] mb-4 leading-tight font-bold text-[#111]">
                {slideImages[expandedCardIndex].title}
              </h1>

              <h2 className="text-lg mb-6 text-[#333]">
                {slideImages[expandedCardIndex].subtitle}
              </h2>

              {slideImages[expandedCardIndex].content && (
                <div className="mb-6 leading-7 text-[#333] whitespace-pre-line">
                  {slideImages[expandedCardIndex].content.split('\n\n').map((paragraph, i) => (
                    <p key={i}><Translate>{paragraph}</Translate></p>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-6 flex-col sm:flex-row">
                <a
                  href={slideImages[expandedCardIndex].Links}
                  className={`inline-flex items-center justify-center bg-[rgb(252,232,164)] text-[#002677] px-4 py-2 rounded-full font-semibold min-w-[100px] shadow-sm`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Translate>{slideImages[expandedCardIndex].ButtonText}</Translate>
                </a>
                {slideImages[expandedCardIndex].subLinks && (
                  <a
                    href={slideImages[expandedCardIndex].subLinks}
                    className="inline-flex items-center justify-center bg-[#F8F3E2] text-[#002677] px-4 py-2 rounded-full font-semibold min-w-[100px] shadow-sm"
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
