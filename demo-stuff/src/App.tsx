import React, { useEffect, useState } from "react";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [hideMiddle, setHideMiddle] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (!started) return;

    // First fade out the middle "ta"
    const timer1 = setTimeout(() => setHideMiddle(true), 600);

    // Then show final "talks"
    const timer2 = setTimeout(() => setShowFinal(true), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [started]);

  const handleClick = () => {
    if (!started) {
      setStarted(true);
    }
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      {/* Initial "taltaks" */}
      {!showFinal && (
        <>
          <span className={styles.word}>tal</span>
          <span className={`${styles.word} ${hideMiddle ? styles.hidden : ""}`}>
            ta
          </span>
          <span className={styles.word}>ks</span>
        </>
      )}

      {/* Final "talks" */}
      <span
        className={`${styles.final} ${showFinal ? styles.finalShow : ""}`}
      >
        talks 🗣️ 
      </span>
    </div>
  );
};

export default App;
