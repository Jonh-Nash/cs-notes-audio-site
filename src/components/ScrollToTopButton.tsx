"use client";
import { useState, useEffect } from "react";

interface ScrollToTopButtonProps {
  targetSelector?: string;
  showAfterScroll?: number;
  buttonText?: string;
}

export default function ScrollToTopButton({
  targetSelector = "#top",
  showAfterScroll = 200,
  buttonText = "↑ 文字選択に戻る",
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfterScroll) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAfterScroll]);

  const scrollToTop = () => {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // フォールバック: ページの先頭にスクロール
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bg-gray-900/80 hover:bg-gray-900/90 border border-gray-700/50 text-gray-100 text-lg font-light backdrop-blur-sm scroll-to-top-button"
      aria-label="文字選択エリアに戻る"
    >
      {buttonText}
    </button>
  );
}
