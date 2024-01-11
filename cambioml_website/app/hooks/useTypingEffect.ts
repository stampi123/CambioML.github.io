import { useState, useEffect } from 'react';

export const useTypingEffect = (words: string[],
    typeInterval: number = 200,
    deleteInterval: number = 100) => {
    const [wordIndex, setWordIndex] = useState(0);
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    function type() {
        const currentWord = words[wordIndex];
        const shouldDelete = isDeleting ? 1 : -1;
        setText(current => currentWord.substring(0, current.length - shouldDelete));
        if (!isDeleting && text === currentWord) {
          setTimeout(() => setIsDeleting(true), 100);
        } else if (isDeleting && text === '') {
          setIsDeleting(false);
          setWordIndex((current) => (current + 1) % words.length);
        }
      }

      useEffect(() => {
        const timer = setTimeout(type, isDeleting ? deleteInterval : typeInterval);
        return () => clearTimeout(timer);
      }, [wordIndex, isDeleting, text]);

      return text;
};