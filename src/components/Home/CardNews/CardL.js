
import cardNews from "./CardNews";

export default function cardL(card) {
  return (
    <div
      className="relative overflow-hidden flex cursor-default items-center justify-center transition-all duration-300 rounded-xl border border-slate-200/85 bg-white/95 shadow-[0_10px_28px_rgba(10,44,126,0.06)] hover:border-[#0A2C7E]/20 hover:shadow-[0_14px_34px_rgba(10,44,126,0.1)] dark:border-white/10 dark:bg-[#151b23] w-full h-auto lg:aspect-[3/1]"
    >
      {cardNews(card)}
    </div>
  );
}
