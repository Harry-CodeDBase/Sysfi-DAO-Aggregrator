import React, { useState, useEffect } from "react";

const Type = () => {
  const texts = [
    "Welcome to Sysfi",
    "Run your DAO",
    "Explore DeFi",
    "Own Community",
  ];

  const typingSpeed = 100; // Speed of typing each character
  const deletingSpeed = 50; // Speed of deleting each character
  const delayBetweenTexts = 1500; // Delay between finishing typing and starting deletion
  const delayBeforeNextText = 800; // Delay before typing the next text

  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    if (!isDeleting && currentText.length < texts[currentIndex].length) {
      // Typing effect
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          texts[currentIndex].substring(0, prev.length + 1)
        );
      }, typingSpeed);
    } else if (isDeleting && currentText.length > 0) {
      // Deleting effect
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          texts[currentIndex].substring(0, prev.length - 1)
        );
      }, deletingSpeed);
    } else if (
      !isDeleting &&
      currentText.length === texts[currentIndex].length
    ) {
      // Pause before deleting
      timer = setTimeout(() => setIsDeleting(true), delayBetweenTexts);
    } else if (isDeleting && currentText.length === 0) {
      // Move to the next text
      setIsDeleting(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
      timer = setTimeout(() => {}, delayBeforeNextText);
    }

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    texts,
    currentIndex,
    typingSpeed,
    deletingSpeed,
    delayBetweenTexts,
    delayBeforeNextText,
  ]);

  return (
    <div>
      <h1 className="text-lg sm:text-2xl uppercase text-teal-400 font-bold text-center mb-4 ">
        {currentText}
        <span className="border-r-2 border-white animate-blink"></span>
      </h1>
    </div>
  );
};

export default Type;
