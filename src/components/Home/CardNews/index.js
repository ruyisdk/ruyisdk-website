import React, { useState, useEffect } from "react";
import Translate from "@docusaurus/Translate";

import "react-slideshow-image/dist/styles.css";

export default function CardNews() {

  // Define state variables
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

  // Card sizes enum
  const CardSizes = {
    L: "large",   // full width, 2x height
    M: "medium",  // full width, 1x height
    S: "small",   // half width, 1x height
  };

  // Layout logic for responsive design and grouping small cards

  // Tailwind class mappings for card layouts and elements (component scope)
  const classes = {
    cardLarge:  'relative overflow-hidden flex items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full h-auto lg:h-[240px] lg:h-[480px]',
    cardMedium: 'relative overflow-hidden flex items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full h-auto lg:h-[240px]',
    cardSmall:  'relative overflow-hidden flex items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full lg:w-[calc(50%_-_0.5rem)] h-auto lg:h-[240px] lg:flex-none',
  };

  const organizeCards = () => {
    let result = [];
    let currentSmallCards = [];

    // Process all cards
    slideImages.forEach((card, index) => {

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
      title: <Translate>RuyiSDK 包管理器</Translate>,
      subtitle: <Translate>从包管理器获取 RuyiSDK 资源</Translate>,
      Image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      Links: "/docs/intro",
      size: CardSizes.S,            // Small card (half width, 1x height)
    },
    {
      title: <Translate>Support Matrix</Translate>,
      subtitle: <Translate>RISC-V 开发板与操作系统支持矩阵</Translate>,
      Image: "img/ruyi-logo-720.svg",
      Links: "https://matrix.ruyisdk.org/",
      size: CardSizes.S,            // Small card (half width, 1x height)
    },
    {
      title: <Translate>Eclipse 插件</Translate>,
      subtitle: <Translate>RuyiSDK 包管理器的 Eclipse 集成</Translate>,
      Image: "img/ruyi-logo-720.svg",
      Links: "/docs/IDE/",
      subLink: "https://marketplace.eclipse.org/content/ruyisdk",
      subText: "Marketplace",
      size: CardSizes.S,            // Small card (half width, 1x height)
    },
    {
      title: <Translate>VS Code 插件</Translate>,
      subtitle: <Translate>RuyiSDK 包管理器的 VS Code 集成</Translate>,
      Image: "/img/home-cardnews-vscode.png",
      Links: "/docs/VSCode-Plugins/",
      subLink: "https://marketplace.visualstudio.com/items?itemName=RuyiSDK.ruyisdk-vscode-extension",
      subText: "Marketplace",
      size: CardSizes.S,            // Small card (half width, 1x height)
    },
  ];

  const organizedCards = organizeCards();

  // Render a single card
  const renderCard = (card) => {

    // Determine if card should have clickable styling
    const cardClassName = `${card.layoutClass} "cursor-default"`;

    return (
      <div
        key={card.index}
        className={cardClassName}
      >
        <div
          className="absolute inset-0 bg-cover bg-center z-0 bg-(--ifm-color-primary-lightest)/10 bg-blend-soft-light"
          style={{
            backgroundImage: `url(${card.Image})`,
            opacity: 0.18,
          }}
        />

        <div className="relative flex flex-col justify-center items-center text-center z-10 p-8 w-[85%]">
          <p className="text-2xl font-bold mb-4 tracking-tight text-(--home-little-title-color) drop-shadow-md">
            {card.title}
          </p>
          <p className="font-medium text-[1.05rem] mb-4 text-(--home-subtitle-color) drop-shadow-md">
            {card.subtitle}
          </p>
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            <a target="_blank" href={card.Links} className="secondary-button" rel="noopener noreferrer">
              <Translate id="home.cardnews.learnmore">了解更多</Translate>
            </a>
            {card.subLink && (
              <a target="_blank" href={card.subLink} className="tertiary-button" rel="noopener noreferrer">
                <Translate>{card.subText}</Translate>
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
    </>
  );
}
