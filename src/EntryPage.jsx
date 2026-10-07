import { useState } from 'react';
import App from './App.jsx';
import Intro from './Intro.jsx';

const completedKey = 'shot.intro.complete.v1';

function hasCompletedIntro() {
  try { return window.localStorage.getItem(completedKey) === '1'; }
  catch { return false; }
}

export default function EntryPage() {
  const [completed, setCompleted] = useState(hasCompletedIntro);

  function finishIntro() {
    try { window.localStorage.setItem(completedKey, '1'); }
    catch { /* The app still opens when the browser cannot save this preference. */ }
    setCompleted(true);
    window.scrollTo(0, 0);
  }

  return completed ? <App /> : <Intro onComplete={finishIntro} />;
}
