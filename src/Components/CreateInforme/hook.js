import { useEffect } from 'react';

const useDebouncedResizeObserver = (callback, delay = 100) => {
  useEffect(() => {
    let timeoutId;

    const handleResize = (entries) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(entries);
      }, delay);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const observedElement = document.getElementById('observedElement'); // Cambia esto al elemento que deseas observar

    if (observedElement) {
      resizeObserver.observe(observedElement);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [callback, delay]);
};

export default useDebouncedResizeObserver;
