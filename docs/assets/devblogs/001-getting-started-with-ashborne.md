---
slug: devblog-001
title: "Beginning Ashborne - A Quick Overview"
description: "An outline of Ashborne's vision, purpose and tech stack."
date: 2026-02-17
tags: Ashborne, General, Reflection
excerpt: "In this devblog, I cover the basics of Ashborne, what the project looks like, and its vision, purpose and tech stack."
---

I've been working on ***Ashborne*** - a narrative-based text RPG - for 8 months now and it's time to share what I've done, my thought process in that time, and where to go from here.

## The Vision

*Ashborne* is an interactive and immersive fiction text RPG playable on the browser that combines traditional storytelling with dynamic, player-driven choices through new and innovative technologies and systems.

For example (sneak peak into future devblogs!): the game now revolves around Masks, an abstraction of identity into physical objects that change how your character views the world and how others view your character through modular behaviour adaptation.

The project was originally built with no emotional or storytelling aspect considered. However, studying Shakespeare's works in English class led me to adapt the experience and ultimately enter it into *Young ICT Explorers* (YICTE).

Ashborne attempts to change how players view the world through an emphasis of three intertwined "pillars":

1. **The Cost of Power** - power and control is never free. It comes at a cost to your conscience and identity.
2. **The Cycle of Violence** - violence and brutality is all throughout history, and history repeats itself.
3. **The Question of Identity** - what does it mean to be "yourself"? And when you make the drastic decisions you'll eventually be faced with, who do you become?

## Tech Stack Decisions

Choosing the right tools is crucial for any project, and Ashborne is no exception! Here's what I'm working with:

- **C#** - The backbone of the game logic. I chose C# as it's my most comfortable language and comes with plenty of web and game development support while still remaining performant and clean.
- **Blazor** - For building the interactive web UI. It is the most modern solution for C# web development and allows for direct running of C# code within the browser.
- **[Ink](https://www.inklestudios.com/ink/)** - A powerful narrative scripting language by Inkle. Used in every single dialogue interaction in the game.
- **Github Pages** - My current method of hosting Ashborne online for free

You may be wondering - why on the browser? Why not use something like Unity? Later, if the project grows to a much bigger scope (despite it already being quite large now), I may consider porting over to a proper game engine such as Unity. However, as of now the browser is perfect. It provides:

- Ease of development setup,
- Insane accessibility across most modern devices,
- And flexibility in what I can code

The characteristics of a text-first system make a lightweight web architecture more appropriate.

## My own goals for this project

Here's where the starting quote becomes most relevant. I'm still quite young and learning - so what do I want to get out of this project the most?
It is not:

- To create the perfect narrative driven text RPG
- Or to change the entire world forever

However, I wouldn't complain if either actually do happen. :)
<br>My personal goals for the project include, but are not limited to:
- Developing my software engineering and design skills heavily
- Changing at least one person's life or view on the world
- Challenging myself to start and finish a large, complex, multi-year project
- Documenting the entire process in devblogs (while I didn't devblog the first 8 months, after they catch up, devblogs will be released as the development occurs)
- Documenting the entirety (or most) of the codebase as well as open-sourcing it for others to possibly reuse systems

If I can complete all those goals within the next 3 years-ish, I would be one very happy dude.

## So. What's Next?

Of course, development will continue at the (breakneck!) pace that its been going at since the start! I'll also be posting new devblogs *ideally* every time I have something new to say (max a week in-between).

Some of these devblogs will be about Ashborne, some will be about a new simulation project in the planning stages, and some about VEX Robotics (although you probably won't see any of the last for a while).

Looking closer to the near future, the next devblog will outline the core engine structure, including the separation between the core logic and platform-specific ports, and how narrative state propagates through the system. Stay tuned!

---

*Thanks for reading! If you have questions or want to follow along with the project, feel free to reach out or check out the repository [here](https://github.com/halfcomplete/AshborneCode).*
