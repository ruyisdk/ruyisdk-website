
import Translate from "@docusaurus/Translate";

import { byLocale } from "../common/byLocale"

export default function cardNews(card) {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${card.Image})`,
          opacity: 0.065,
        }}
      />

      <div className="relative flex flex-col justify-center items-center text-center z-10 px-5 py-7 sm:p-8 w-full sm:w-[88%]">
        <p className="text-2xl font-bold mb-3 tracking-tight text-(--home-little-title-color)">
          {byLocale(card.title)}
        </p>
        <p className="font-medium text-[1.02rem] mb-4 text-(--home-subtitle-color)">
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
