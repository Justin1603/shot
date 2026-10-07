import { useEffect, useRef, useState } from 'react';
import './intro.css';

const screens = [
  {
    heading: 'YOU SEE SOMEONE YOU LIKE...',
    lines: ['But have no idea what to say.', 'SHOT gives you a way in.'],
  },
  {
    heading: 'YOU MEET SOMEONE NEW...',
    lines: ['And actually want to get to know them.', 'Skip the awkward small talk.'],
  },
  {
    heading: "YOU'RE ALREADY TALKING...",
    lines: ['But the conversation could use a little something.', 'Break the awkwardness. Get to know them. Make them laugh.'],
  },
  {
    heading: 'WHATEVER THE MOMENT...',
    reveal: 'Take a SHOT.',
    lines: ['Pick a prompt.', 'Show them your phone.', 'See where it goes.'],
  },
];

export default function Intro({ onComplete }) {
  const [step, setStep] = useState(-1);
  const heading = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setStep(0), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (step >= 0) {
      window.scrollTo(0, 0);
      heading.current?.focus({ preventScroll: true });
    }
  }, [step]);

  if (step < 0) {
    return <main className="shot-intro shot-splash" aria-label="SHOT splash">
      <div className="shot-splash-content">
        <p className="shot-splash-wordmark">SHOT</p>
        <h1>Don't know what to say?<br />Show them.</h1>
      </div>
    </main>;
  }

  const screen = screens[step];
  const last = step === screens.length - 1;

  return <main className="shot-intro" aria-label="SHOT walkthrough">
    <header className="shot-intro-header"><p className="wordmark">SHOT</p></header>
    <div className="shot-intro-content" key={step}>
      <h1 ref={heading} tabIndex={-1}>{screen.heading}</h1>
      {screen.reveal && <p className="shot-intro-reveal">{screen.reveal}</p>}
      <div className={`shot-intro-copy${last ? ' shot-intro-product-copy' : ''}`}>
        {screen.lines.map((line) => <p key={line}>{line}</p>)}
      </div>
    </div>
    <footer className="shot-intro-footer">
      <p className="shot-intro-progress" aria-label={`Walkthrough screen ${step + 1} of ${screens.length}`}>{step + 1} / {screens.length}</p>
      <button className="shot-intro-action" onClick={last ? onComplete : () => setStep((current) => current + 1)}>{last ? 'Get started' : 'Next'}</button>
    </footer>
  </main>;
}
