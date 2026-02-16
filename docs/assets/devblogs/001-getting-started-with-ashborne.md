---
slug: devblog-001
title: "The First 8 Months of Ashborne - A Retroactive Reflection"
description: "An overview of Ashborne's first 8 months of its development, including its architecture, design and purpose."
date: 2026-02-07
tags: Ashborne, General, Reflection
excerpt: "In this devblog, I cover the architecture, designs and progress I've made on the interactive narrative experience for the first 8 months of its development."
---

I've been working on this narrative-based text RPG for 8 months now, and it's time to share what I've done, my thought process in the past 8 months, and where to go from here.

## The Vision

Ashborne is an interactive fiction text RPG built using C#, Blazor, and the Ink scripting language. The goal is to create an immersive narrative experience that combines traditional storytelling with dynamic, player-driven choices using new and innovative technologies and systems.

The project was originally built with no emotional or storytelling aspect considered. However, 

## Tech Stack Decisions

Choosing the right tools is crucial for any project. Here's what I'm working with:

- **C#** - The backbone of the application logic
- **Blazor** - For building the interactive web UI
- **Ink** - A powerful narrative scripting language by Inkle

## Initial Setup

The first step was setting up the project structure. I wanted something modular and easy to maintain as the project grows. Here's a quick overview of the architecture:

```
Ashborne/
├── src/
│   ├── Core/
│   ├── Narrative/
│   └── UI/
├── stories/
└── tests/
```

## What's Next

In the next devblog, I'll dive into the narrative engine implementation and how Ink integrates with the Blazor frontend. Stay tuned!

---

Thanks for reading! If you have questions or want to follow along with the project, feel free to reach out or check out the repository.
