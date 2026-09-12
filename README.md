# BizzBrain Conversations

Build a premium production-quality BizzBrain MVP web app that visually and behaviorally feels like WhatsApp, because BizzBrain will eventually integrate directly with WhatsApp.

UI Direction

Use a WhatsApp-inspired color theme: deep green, light green, white, soft gray.

Do NOT make it look like a generic AI SaaS dashboard.

Familiar WhatsApp-style chat layout, spacing, message bubbles, timestamps, profile header, chat list and bottom composer.

Clean, premium, realistic product UI — not flashy or obviously AI-generated.

Avoid neon gradients, excessive glassmorphism, huge AI graphics and unnecessary cards.

Main Layout

Left: BizzBrain chat list
Center: Main conversation
Right: Small optional “Business Memory” panel showing useful context.

Demo Conversation

Show realistic interactions:

User:
“Innaiku 50 tea vithen, one 15 rupees.”

BizzBrain:
“Sale recorded ✓
50 Tea × ₹15 = ₹750”

User:
“Murugan ku next week 40k pay pannanum.”

BizzBrain:
“Remembered ✓
Murugan — ₹40,000 pending
Due: Next week”

User:
“Innaiku profit evlo?”

BizzBrain:
“Today’s Profit
Revenue: ₹18,500
Expenses: ₹4,200
Profit: ₹14,300”

Core Experience

The product should clearly communicate:

Talk → Understand → Remember → Analyze → Answer

Support natural Tamil, Tanglish, Hindi and English, including language switching inside the same conversation.

Add:

Voice-message style input

Text input

Microphone button

Send button

Typing indicator

Read receipts

Natural message timestamps

Smooth but subtle animations

BizzBrain Identity

Keep the product name BizzBrain.

Position it as:
“Your Business. In Your Conversation.”

The interface should make an investor immediately understand:

WhatsApp → BizzBrain AI → Business Records → Business Memory → Insights

Build it as a polished investor-demo MVP that can later connect the same backend to the real WhatsApp Business API.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/53b44cff-9dec-49b4-9dd9-67b40247ee42).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
