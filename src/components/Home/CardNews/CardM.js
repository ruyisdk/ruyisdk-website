
import cardNews from "./CardNews";

export default function cardM(card) {
  return (
    <div
      className="relative overflow-hidden flex cursor-default items-center justify-center transition-transform duration-300 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full h-auto lg:aspect-[5/1]"
    >
      {cardNews(card)}
    </div>
  );
}
