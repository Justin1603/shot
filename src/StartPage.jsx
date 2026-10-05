import { useEffect } from 'react';
import { modes } from './prompts.js';
import './start.css';

export default function StartPage() {
  const example = modes[0].prompts[0];

  useEffect(() => {
    document.title = 'SHOT — Break the ice with your phone.';
    document.querySelector('meta[name="description"]').content = 'Pick a prompt. Show your phone. They tap yes or no. SHOT helps you make the first move.';
  }, []);

  return <main className="start-page">
    <header className="start-header"><p className="wordmark">SHOT</p></header>
    <div className="start-layout">
      <section className="start-intro" aria-labelledby="start-heading">
        <h1 id="start-heading">Don't know what to say?<br />Show them.</h1>
        <p className="start-description">Pick a prompt. Show your phone.<br />They tap yes or no.</p>
        <a className="start-cta" href="/">Try SHOT</a>
        <p className="start-note">Five free prompts per intention. No sign-up.</p>
      </section>
      <figure className="start-example" aria-label="Example of a SHOT prompt">
        <div className="start-example-card" style={{ '--example-color': modes[0].color }}>
          <p className="start-example-prompt">{example.text}</p>
          <div className="start-example-answers">
            <span>{example.yes}</span>
            <span>{example.no}</span>
          </div>
        </div>
        <figcaption>An example of what they'll see.</figcaption>
      </figure>
    </div>
    <p className="start-ending">Break the ice. Then put the phone away.</p>
  </main>;
}
