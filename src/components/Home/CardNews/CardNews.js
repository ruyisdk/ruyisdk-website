
import Translate from "@docusaurus/Translate";

import { byLocale } from "../common/byLocale"

export default function cardNews(card) {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center z-0 bg-(--ifm-color-primary-lightest)/2 bg-blend-soft-light"
        style={{
          backgroundImage: `url(${card.Image})`,
          opacity: 0.15,
        }}
      />

      <div className="relative flex flex-col justify-center items-center text-center z-10 p-8 w-[85%]">
        <p className="text-2xl font-bold mb-4 tracking-tight text-(--home-little-title-color) drop-shadow-md">
          {byLocale(card.title)}
        </p>
        <p className="font-medium text-[1.05rem] mb-4 text-(--home-subtitle-color) drop-shadow-md">
          {byLocale(card.subtitle)}
        </p>
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          <a target="_blank" href={byLocale(card.Links)} className="secondary-button" rel="noopener noreferrer">
            <Translate id="home.cardnews.learnmore">了解更多</Translate>
          </a>
          {card.subLink && (
            <a target="_blank" href={byLocale(card.subLink)} className="tertiary-button" rel="noopener noreferrer">
              {byLocale(card.subText)}
            </a>
          )}
        </div>
      </div>
    </>
  );
}
