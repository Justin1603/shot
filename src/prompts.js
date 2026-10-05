const prompt = (text, yes = 'YES, I’M IN', no = 'NO THANKS') => ({ text, yes, no });

export const modes = [
  {
    id: 'move', name: 'Make a move', color: '#F25572', icon: 'heart',
    description: "Let them know you're interested.",
    prompts: [
      prompt('Coffee sometime?'),
      prompt('I was going to play it cool. Can I say hi instead?', 'YES, SAY HI'),
      prompt('You caught my eye. Want to talk for a minute?', 'YES, LET’S TALK'),
      prompt('I’d like to get to know you. Would you like that too?', 'YES, I WOULD'),
      prompt('Can this be the part where we meet?', 'YES, LET’S MEET'),
    ],
  },
  {
    id: 'flirt', name: 'Flirt a little', color: '#F29C55', icon: 'spark',
    description: 'Keep it playful without going all in.',
    prompts: [
      prompt('Can I flirt a little?', 'YES, GO ON'),
      prompt('My best opening line is apparently a phone screen. Is it working?', 'YES, A LITTLE'),
      prompt('You’re making it very hard to act casual. Can we talk?', 'YES, LET’S TALK'),
      prompt('Can I make you smile, or should I keep practising?', 'YES, GIVE IT A SHOT'),
      prompt('I think we’d make a good coffee date. Want to test that theory?'),
    ],
  },
  {
    id: 'awkward', name: 'Break the awkwardness', color: '#55D5F2', icon: 'ice',
    description: 'Make the weird silence less weird.',
    prompts: [
      prompt('Can we skip the awkward part?', 'YES, PLEASE'),
      prompt('I don’t know what to say. Can we start with hi?', 'YES, HI'),
      prompt('Two people. One weird silence. Want to fix that?', 'YES, LET’S TALK'),
      prompt('This is my tiny act of courage. Want to say hello?', 'YES, HELLO'),
      prompt('Would a quick chat make this less awkward?', 'YES, LET’S CHAT'),
    ],
  },
  {
    id: 'conversation', name: 'Start a conversation', color: '#55F28C', icon: 'wave',
    description: 'Find an easy way to say hi.',
    prompts: [
      prompt('Got a minute for a hello?', 'YES, HI'),
      prompt('Want to tell me the best part of your day?', 'YES, LET’S TALK'),
      prompt('Can I ask what brought you here?', 'YES, ASK AWAY'),
      prompt('Want to trade one good recommendation?', 'YES, LET’S TRADE'),
      prompt('No clever opener. Just a chat?', 'YES, LET’S CHAT'),
    ],
  },
  {
    id: 'know', name: 'Get to know them', color: '#F2D055', icon: 'chat',
    description: 'Skip the small talk and learn something interesting.',
    prompts: [
      prompt('Can I ask you something more interesting than “what do you do”?', 'YES, ASK AWAY'),
      prompt('Want to tell me something you could talk about for hours?', 'YES, LET’S TALK'),
      prompt('Can I ask what you’re looking forward to?', 'YES, ASK ME'),
      prompt('Want to swap a small thing that makes us happy?', 'YES, LET’S SWAP'),
      prompt('One random question each. Want to play?', 'YES, LET’S PLAY'),
    ],
  },
  {
    id: 'laugh', name: 'Make them laugh', color: '#D4AFFF', icon: 'smile',
    description: 'Start with something worth smiling about.',
    prompts: [
      prompt('Want to hear a truly terrible joke?', 'YES, LET’S HEAR IT'),
      prompt('My social skills are buffering. Can we try a hello?', 'YES, HI'),
      prompt('I brought a phone to a conversation. Want to give me a chance?', 'YES, LET’S TALK'),
      prompt('Want to debate whether cereal is soup?', 'YES, LET’S DEBATE'),
      prompt('Can we pretend this was a very smooth introduction?', 'YES, VERY SMOOTH'),
    ],
  },
];
