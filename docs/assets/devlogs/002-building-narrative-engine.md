---
slug: devlog-002
title: "Building the Narrative Engine"
description: "Diving deep into the narrative engine implementation and how Ink integrates with Blazor for interactive storytelling."
date: 2026-02-14
tags: Ashborne
excerpt: "In this devlog, I explore the narrative engine architecture and show how Ink scripting integrates seamlessly with Blazor to create dynamic, branching storylines."
---

After setting up the foundation, it's time to tackle the heart of Ashborne: the narrative engine.

## Architecture Overview

The narrative engine is designed with modularity in mind. Here's how the components interact:

| Component | Responsibility |
|-----------|----------------|
| Story Manager | Loads and manages Ink stories |
| State Tracker | Persists player choices and progress |
| Renderer | Displays narrative text in the UI |
| Choice Handler | Processes player decisions |

## Ink Integration

Ink is a powerful scripting language designed for interactive narratives. Here's a simple example:

```ink
=== start ===
You stand at the crossroads.
* [Go left] -> left_path
* [Go right] -> right_path

=== left_path ===
The forest grows darker...
-> END

=== right_path ===
Sunlight filters through the trees...
-> END
```

## State Management

One of the trickiest parts was managing state across sessions. I implemented a simple JSON-based save system:

```csharp
public class GameState
{
    public string CurrentKnot { get; set; }
    public Dictionary<string, object> Variables { get; set; }
    public List<string> VisitedNodes { get; set; }
}
```

## Next Steps

In the next devlog, I'll cover the UI components and how player choices are visualized. Stay tuned!

---

Thanks for reading! Feel free to reach out with questions or feedback.
