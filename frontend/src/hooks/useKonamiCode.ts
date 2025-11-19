import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
];

export function useKonamiCode(): boolean {
  const [activated, setActivated] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const newSequence = [...keySequence, e.key].slice(-KONAMI_CODE.length);
      setKeySequence(newSequence);

      // Check if sequence matches
      if (newSequence.join(',') === KONAMI_CODE.join(',')) {
        setActivated(true);
        setKeySequence([]); // Reset after activation

        // Reset after 5 seconds
        setTimeout(() => {
          setActivated(false);
        }, 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence]);

  return activated;
}
