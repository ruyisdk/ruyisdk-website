
import cardNews from "./CardNews";

export default function cardS(cards) {
  return (
    <>
      {cards.map(card => {
        return (
          <div
            key={card.index}
            className="relative overflow-hidden flex cursor-default items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full lg:w-[calc(50%_-_0.5rem)] h-auto lg:h-[240px] lg:flex-none"
          >
            {cardNews(card)}
          </div>
        )
      })}
    </>
  );
}