DESIGN.md — SHOT
Read this before building or changing any screen. If a choice isn't covered here, ask instead of guessing.

1. The feeling, in labels
Bold editorial — strong typography and confident hierarchy give SHOT confidence on behalf of a user who may not feel confident.
Playful details — colour, copy, motion and small interactions reduce the tension of making the first move without making the product childish.
Card-first — prompts are the primary visual object. The interface exists to help users find and show them.
Airy — generous whitespace, large padding and restrained information density make every prompt feel intentional.
Human — SHOT speaks like a socially confident friend, not software reporting states.

2. Visual direction
Overall
Bold editorial + playful details.
The visual foundation should feel contemporary and confident, while the personality comes from:
Saturated pastel colours
Distinctive typography
Playful copy
Smooth interactions
Small graphic details
Avoid:
Corporate SaaS aesthetics
Excessively cute UI
Meme-heavy design
Heavy illustrations
Gradients
Heavy shadows
Excessive decoration
Dense dashboards

3. Typography
Display + prompts
Bricolage Grotesque
Use for:
Prompt cards
Show Mode prompts
Headlines
Mode names
Result-state messages
SHOT wordmark
Major brand moments
Its purpose is to give SHOT its distinctive, playful personality.
Functional UI
Urbanist
Use for:
Buttons
Mode descriptions
Navigation
Labels
Counters
Instructions
Supporting copy
System information
Rule
Bricolage gives SHOT personality. Urbanist gets out of its way.
Don't mix them unnecessarily.

Dynamic prompt type scale
Prompt typography changes according to content length.
Very short prompts: 56–64px Bricolage Grotesque
Medium prompts: 40–48px
Long prompts: 32–40px
The principle:
The fewer the words, the louder the prompt.
Additional scale:
Screen heading: 28–32px Bricolage Grotesque
Primary UI/button: 16–18px Urbanist
Body/supporting copy: 16px Urbanist
Labels/counters: 14px Urbanist
Exact responsive breakpoints can be refined during implementation, but prompts must remain visually dominant.

4. Colour system
Foundation
Background / SHOT Cream
#FFFDF7
Primary text / Soft Black
#171717
Cream replaces pure white throughout the primary interface.
Soft Black replaces pure black for text and functional UI.

Mode colours
Each mode owns a saturated pastel colour.
Mode
Colour
Make a move
#F25572
Flirt a little
#F29C55
Break the awkwardness
#55D5F2
Start a conversation
#55F28C
Get to know them
#F2D055
Make them laugh
#D4AFFF
Colour rule
Colour identifies the mode. Typography identifies SHOT.
The interface foundation remains cream + soft black.
Once the user enters a mode, that mode's colour becomes the contextual colour of the prompt experience.
Do not introduce additional colours without a defined functional reason.

5. Shape & surface system
Cards
16px corner radius
Completely flat
No shadow
No border
Mode colour provides separation
Generous internal padding
Buttons
Fully rounded pill shape
Flat
No heavy shadow
Urbanist labels
Large tap targets
Navigation
Floating pill navigation
Sits slightly above bottom edge
Home / Saved / Profile
Visually quiet compared with prompt cards
No heavy shadow
Shape hierarchy
Cards = 16px radius
Actions/navigation = pill

6. Iconography
Use solid geometric icons.
Icons should:
Be simple
Use consistent geometry
Have strong visual presence
Default to #171717
Support content rather than dominate it
Avoid:
Hand-drawn doodles
Sticker graphics
Detailed illustrations
Inconsistent icon styles

7. Spacing
Use an airy editorial spacing system.
Prioritize:
Generous horizontal margins
Large card padding
Significant space between content groups
Whitespace around typography
Natural scrolling instead of compressing information
Do not squeeze content onto a screen simply because there is technically room.
Show Mode should be particularly spacious.

8. Motion
SHOT uses smooth + playful motion.
General transition range:
250–350ms
Use:
Smooth vertical card movement
Natural swipe momentum
Subtle button press feedback
Gentle state transitions
Light spring behaviour where appropriate
Avoid:
Excessive bouncing
Novelty animations
Slow cinematic transitions
Signature interaction
Prompt card → tap → smoothly expands → supporting UI disappears → Show Mode
The transition should make it feel as though the user is taking the card they were browsing and physically presenting it.

9. Home
Purpose
Help Person A immediately choose what they want to accomplish.
Header
Simple:
SHOT
in Bricolage Grotesque.
No separate logo symbol.
The wordmark should be confident but shouldn't dominate the screen.

Headline
Don't know what to say? Show them.
Treatment:
Compact
Left aligned
Bricolage Grotesque
Strong but not oversized
The six modes are the primary visual focus.

Mode layout
Use a vertical list of six wide cards.
Scrolling is acceptable.
Each card contains:
Solid geometric icon
Mode name
Short description
Everything is left aligned.
The entire card is tappable.

Mode content
Make a move
Colour: #F25572
Description:
Let them know you're interested.

Flirt a little
Colour: #F29C55
Description:
Keep it playful without going all in.

Break the awkwardness
Colour: #55D5F2
Description:
Make the weird silence less weird.

Start a conversation
Colour: #55F28C
Description:
Find an easy way to say hi.

Get to know them
Colour: #F2D055
Description:
Skip the small talk and learn something interesting.

Make them laugh
Colour: #D4AFFF
Description:
Start with something worth smiling about.

10. Prompt Deck
Purpose
Help Person A find something they genuinely feel comfortable showing Person B.
Browsing behaviour
Vertical card browsing.
Current card occupies approximately 75–80% of the available browsing area.
A small portion of the next card remains visible below it.
This teaches vertical swiping without requiring an instruction.
User can:
Swipe upward → next
Swipe downward → previous
Tap → Show Mode
Favorite → heart
One prompt remains visually dominant at all times.

Prompt card structure
Top — functional header
Contains:
Mode label
Explicit progress: 2 / 5
Heart icon
Mode label and progress use Urbanist.
Heart uses the solid geometric icon system.
Middle
Large dynamically sized prompt.
Bricolage Grotesque
Left aligned
Generous breathing room
Prompt is the dominant element
Bottom
Tap to show
Urbanist.
Visually secondary.

Favorite
Use a heart.
Default:
Outline heart.
Saved:
Filled heart.
The heart means:
I like this prompt / save this for later.
It exists for Person A and disappears entirely in Show Mode.
For the sprint MVP, it may be visually present without being functional.

Progress
Use explicit numerical progress:
2 / 5
Small and secondary.
Do not use dots or a progress bar.
Progress disappears completely in Show Mode.

11. Premium preview
After the fifth free prompt, the user reaches the Premium state.
Visual treatment
Show:
Blurred real sixth prompt
2–3 additional cards visibly stacked behind it
Content remains unreadable
Same soft-card visual system
This should communicate:
There is genuinely more content behind this point.
Do not immediately transition to a completely disconnected subscription screen.
Copy
You've got more shots to take.
Unlock the full deck.
Primary CTA:
Unlock Premium
Secondary:
Maybe later
For the Build Sprint V1, Premium purchasing does not need to function.

12. Show Mode
Purpose
This screen is for Person B, not Person A.
When Person A taps a browsing card:
Card smoothly expands until its mode colour fills the entire screen.
There is no intermediate confirmation screen.
There is no “Show” button.
There is no “Hand them your phone” instruction.
The interaction should be self-explanatory.

Remove from Show Mode
Everything Person B doesn't need:
Mode label
2 / 5
Favorite
“Tap to show”
Bottom navigation
Browsing controls
Mode explanation
Rule
Information shown to Person A for decision-making disappears if it doesn't help Person B respond.

Prompt layout
Prompt is:
Left aligned
Positioned in the upper half
Bricolage Grotesque
Dynamically sized
Given generous negative space
The lower portion of the screen is reserved for responses.
This creates:
Read → Respond

Background
The selected mode colour fills the entire screen.
Example:
Flirt a little → #F29C55
The colour remains continuous from browsing card → expanded Show Mode.

Exit
Small:
×
in the top-left.
Purpose:
Person A can immediately exit if they change their mind.
No confirmation
Returns to Prompt Deck
Visually secondary

13. Responses
Person B receives exactly two response directions:
Positive
and
Negative
There is no Maybe state.
Actual wording changes according to the prompt.
Example:
Coffee sometime?
I'M IN
NO THANKS

Response layout
Responses are:
Full-width
Vertically stacked
Equal visual prominence
Large tap targets
Pill-shaped
Urbanist
Never make the positive option visually stronger than the negative option.
SHOT must not pressure Person B.

Response colours
Both response buttons:
Background: #FFFDF7
Text: #171717
No:
Green = yes
Red = no
Filled vs outline hierarchy
Both options must feel equally legitimate.

14. Result states
Results deliberately return to the quiet SHOT foundation.
Visual treatment
Background: #FFFDF7
Text: #171717
Large Bricolage Grotesque reaction
Generous whitespace
No illustration
No celebration graphics
No colour takeover
Pill-shaped Done button
Positive and negative use the same hierarchy.

Positive
Well… looks like it's your move now 👀
CTA:
Done

Negative
Respect. We pretend this never happened 🤝
CTA:
Done
Never:
Suggest another prompt immediately
Tell Person A to try again
Pressure Person B
Turn rejection into gamification
The interaction is finished.

15. System-state voice
SHOT uses full personality, including utility states.
It should sound like a socially confident friend rather than system software.
Examples:
Loading
Hold up, we're cooking 👀
Error
Well… that was awkward.
Empty Saved
Your saved prompts are looking lonely.
Retry
One more shot?
Offline
No signal. Tragic timing.
Nothing found
Yeah… we've got nothing.
Tone rule
Funny, cheeky and conversational is encouraged.
Never:
Make Person B the joke
Mock rejection
Embarrass Person A
Trivialize consent
Pressure another interaction

16. Navigation
Primary navigation:
Home · Saved · Profile
Presented inside a floating pill near the bottom of the screen.
Use:
Solid geometric icons
Urbanist labels if labels are displayed
Clear active state
Cream + soft-black foundation
Navigation should disappear during Show Mode.
For the Build Sprint V1, Saved and Profile may be visually present without being functional.

17. Screen hierarchy
Home
For: choosing an intention.
Top to bottom:
SHOT wordmark
→ compact headline
→ six vertically stacked mode cards
→ floating navigation
Main action: tap mode → Prompt Deck

Prompt Deck
For: finding the right prompt.
Top to bottom:
Back/navigation context
→ current prompt card
→ next-card peek
Within card:
Mode + x / 5 + heart
→ prompt
→ Tap to show
Main action: tap card → Show Mode

Premium Preview
For: communicating the free limit.
Blurred sixth prompt
→ stacked cards
→ Premium message
→ Unlock Premium
→ Maybe later

Show Mode
For: Person B reading and responding.
Top to bottom:
×
→ large prompt in upper half
→ whitespace
→ positive response
→ negative response
Main action: response → Result

Positive Result
Reaction
→ Done

Negative Result
Reaction
→ Done

18. Core interaction philosophy
The fundamental loop is:
Browse → Choose → Show → Respond → Done
SHOT has two audiences during one interaction:
Person A
Needs:
Modes
Context
Progress
Browsing
Favorites
Decision-making information
Person B
Needs:
The prompt
Two clear choices
An easy exit
Never design one interface as though both users need the same information.

19. Universal principles
SHOT should visually feel confident on behalf of someone who may not feel confident.
Prompts are always the hero.
Typography carries the brand.
Colour communicates mode.
Cream + soft black provide the foundation.
Use Bricolage for personality and Urbanist for interface.
Keep layouts airy.
Cards are flat with 16px corners.
Buttons are pills.
Use solid geometric icons.
Avoid decoration without purpose.
All six modes appear on Home.
Modes describe intent, not location or relationship type.
Never ask users to select boldness; the prompts themselves provide different boldness levels.
Vertical browsing always allows going backward.
The next card peeks into view.
Tapping a prompt directly enters Show Mode.
No intermediate confirmation screen.
No “Hand them your phone” instruction.
Show Mode strips away Person-A-only information.
Person B always receives a clear negative option.
Positive and negative choices receive equal visual weight.
There is no Maybe response.
Never visually manipulate Person B toward a positive response.
Once Person B responds, SHOT's job is finished.
Never automatically continue to another prompt.
Rejection should end gracefully.
Motion adds personality but never slows down the interaction.
System copy can be highly playful; consent/rejection copy cannot be careless.
SHOT exists to move people from their phone into a real interaction.
If a design decision isn't specified here, ask before inventing it.
Final visual foundation
Personality: Bold editorial + playful
Display: Bricolage Grotesque
UI: Urbanist
Background: #FFFDF7
Text: #171717
Colour: six saturated pastel mode colours
Cards: flat · 16px radius
Buttons: pills
Icons: solid geometric
Spacing: airy editorial
Motion: smooth/playful · ~250–350ms
Core visual object: the prompt card
