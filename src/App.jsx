import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { modes } from './prompts.js';

function Icon({ name, className = '' }) {
  const paths = {
    heart: 'M12 21 3.5 12.7C-2 7.2 5.6-.7 12 5.7c6.4-6.4 14 1.5 8.5 7L12 21Z',
    spark: 'm12 1 3.2 7.8L23 12l-7.8 3.2L12 23l-3.2-7.8L1 12l7.8-3.2L12 1Z',
    ice: 'M6 2h12l5 10-5 10H6L1 12 6 2Zm1.8 4L5 12l2.8 6h8.4l2.8-6-2.8-6H7.8Z',
    wave: 'M5 11V7a1.5 1.5 0 0 1 3 0v5-8a1.5 1.5 0 0 1 3 0v8-9a1.5 1.5 0 0 1 3 0v9-6a1.5 1.5 0 0 1 3 0v8l1-2a1.8 1.8 0 0 1 3 2l-3 6c-1 2-3 3-6 3-4 0-6-2-7-5l-2-5c-1-3 2-4 3-2l2 3Z',
    chat: 'M3 3h18v14H9l-6 5V3Zm4 5v2h10V8H7Zm0 4v2h7v-2H7Z',
    smile: 'M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22ZM7 8h3v3H7V8Zm7 0h3v3h-3V8ZM6 14h12a6 6 0 0 1-12 0Z',
    home: 'M1 11 12 1l11 10h-3v11h-6v-7h-4v7H4V11H1Z',
    saved: 'M5 2h14v21l-7-5-7 5V2Z',
    profile: 'M12 1a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM3 23v-3a9 9 0 0 1 18 0v3H3Z',
  };
  return <svg aria-hidden="true" className={`icon ${className}`} viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d={paths[name]} /></svg>;
}

function Navigation({ onHome }) {
  return <nav className="navigation" aria-label="Main navigation">
    <button onClick={onHome} aria-label="Home"><Icon name="home" /><span>Home</span></button>
    <button disabled title="Saved prompts are coming later"><Icon name="saved" /><span>Saved</span></button>
    <button disabled title="Profiles are coming later"><Icon name="profile" /><span>Profile</span></button>
  </nav>;
}

function Presentation({ selection, onClose, onAnswer }) {
  const overlay = useRef(null);
  const close = useRef(null);
  const { mode, prompt, rect } = selection;
  useLayoutEffect(() => {
    close.current.focus({ preventScroll: true });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && rect) {
      overlay.current.animate([
        { clipPath: `inset(${Math.max(0, rect.top)}px ${Math.max(0, innerWidth - rect.right)}px ${Math.max(0, innerHeight - rect.bottom)}px ${Math.max(0, rect.left)}px round 16px)` },
        { clipPath: 'inset(0px round 0px)' },
      ], { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
  }, [rect]);
  return <section ref={overlay} className="presentation" style={{ '--mode-color': mode.color }} aria-label="Show prompt">
    <div className="presentation-inner">
      <button ref={close} className="close-button" onClick={onClose} aria-label="Close prompt">×</button>
      <h1 className={`prompt-text ${typeSize(prompt.text)}`}>{prompt.text}</h1>
      <div className="responses" aria-label="Your response">
        <button className="pill" onClick={() => onAnswer('yes')}>{prompt.yes}</button>
        <button className="pill" onClick={() => onAnswer('no')}>{prompt.no}</button>
      </div>
    </div>
  </section>;
}

function typeSize(text) {
  return text.length < 30 ? 'short' : text.length < 65 ? 'medium' : 'long';
}

export default function App() {
  const [mode, setMode] = useState(null);
  const [selection, setSelection] = useState(null);
  const [answer, setAnswer] = useState(null);
  const deck = useRef(null);
  const openedCard = useRef(null);
  const heading = useRef(null);
  const resultHeading = useRef(null);
  const hasOverlay = Boolean(selection || answer);

  useEffect(() => {
    document.body.style.overflow = hasOverlay ? 'hidden' : '';
    document.querySelector('meta[name="theme-color"]').content = selection ? selection.mode.color : '#FFFDF7';
    return () => { document.body.style.overflow = ''; };
  }, [hasOverlay, selection]);

  useEffect(() => {
    const back = (event) => {
      setMode(modes.find((item) => item.id === event.state?.mode) ?? null);
      setSelection(null);
      setAnswer(null);
      if (selection && event.state?.mode) requestAnimationFrame(() => openedCard.current?.focus({ preventScroll: true }));
    };
    const escape = (event) => {
      if (event.key === 'Escape' && selection) history.back();
    };
    window.addEventListener('popstate', back);
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('popstate', back); window.removeEventListener('keydown', escape); };
  }, [selection]);

  useEffect(() => {
    if (mode && !hasOverlay) heading.current?.focus({ preventScroll: true });
    if (answer) resultHeading.current?.focus({ preventScroll: true });
  }, [mode, answer]);

  function home() {
    history.replaceState(null, '', location.pathname);
    setMode(null); setSelection(null); setAnswer(null);
    window.scrollTo(0, 0);
  }

  function chooseMode(item) {
    history.pushState({ mode: item.id }, '', location.pathname);
    setMode(item);
    window.scrollTo(0, 0);
  }

  function openPrompt(prompt, event) {
    openedCard.current = event.currentTarget;
    history.pushState({ mode: mode.id, show: true }, '', location.pathname);
    setSelection({ mode, prompt, rect: event.currentTarget.getBoundingClientRect() });
  }

  function closePrompt() {
    history.back();
    openedCard.current?.focus({ preventScroll: true });
  }

  function respond(value) {
    history.replaceState({ mode: mode.id, result: true }, '', location.pathname);
    setSelection(null);
    setAnswer(value);
  }

  return <>
    <div className="shell" inert={hasOverlay} aria-hidden={hasOverlay || undefined}>
      {!mode ? <main className="home">
        <header><p className="wordmark">SHOT</p><h1>Don't know what to say?<br />Show them.</h1></header>
        <div className="modes">
          {modes.map((item) => <button key={item.id} className="mode-card" style={{ '--mode-color': item.color }} onClick={() => chooseMode(item)}>
            <Icon name={item.icon} /><div><h2>{item.name}</h2><p>{item.description}</p></div>
          </button>)}
        </div>
      </main> : <main className="deck-page" style={{ '--mode-color': mode.color }}>
        <header className="deck-header"><button className="back-button" onClick={home} aria-label="Back to intentions">←</button><h1 ref={heading} tabIndex={-1}>{mode.name}</h1></header>
        <div className="deck" ref={deck} aria-label={`${mode.name} prompts`} key={mode.id}>
          {mode.prompts.map((prompt, index) => <button key={prompt.text} className="prompt-card" onClick={(event) => openPrompt(prompt, event)} aria-label={`Show prompt ${index + 1}: ${prompt.text}`}>
            <div className="card-header"><span>{mode.name}</span><span>{index + 1} / 5</span></div>
            <p className={`prompt-text ${typeSize(prompt.text)}`}>{prompt.text}</p>
            <span className="tap-label">Tap to show</span>
          </button>)}
        </div>
      </main>}
      <Navigation onHome={home} />
    </div>
    {selection && <Presentation selection={selection} onClose={closePrompt} onAnswer={respond} />}
    {answer && <main className="result" aria-label={`${answer === 'yes' ? 'Positive' : 'Negative'} response`}>
      <div className="result-inner"><h1 ref={resultHeading} tabIndex={-1}>{answer === 'yes' ? 'Well… looks like it’s your move now 👀' : 'Respect. We pretend this never happened 🤝'}</h1><button className="pill done" onClick={home}>Done</button></div>
    </main>}
  </>;
}
