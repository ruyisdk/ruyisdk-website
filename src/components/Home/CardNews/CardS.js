
import cardNews from "./CardNews";

export default function cardS(cards) {
  return (
    <>
      {cards.map(card => {
        return (
          <div
            key={card.index}
            className="relative overflow-hidden flex cursor-default items-center justify-center transition-all duration-300 rounded-xl border border-slate-200/85 bg-white/95 shadow-[0_10px_28px_rgba(10,44,126,0.06)] hover:border-[#0A2C7E]/20 hover:shadow-[0_14px_34px_rgba(10,44,126,0.1)] dark:border-white/10 dark:bg-[#151b23] dark:shadow-[0_12px_30px_rgba(0,0,0,0.38)] dark:hover:border-[#79a8ff]/30 dark:hover:bg-[#1a222e] w-full lg:w-[calc(50%_-_0.5rem)] h-auto lg:aspect-[5/2] lg:flex-none"
          >
            {cardNews(card)}
          </div>
        )
      })}
    </>
  );
}
