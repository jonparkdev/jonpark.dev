---
name: "shrink-to-start"
description: "Use when the user feels stuck, paralyzed, or unmotivated to start something with no deadline (\"I don't know where to start\", \"I should study X\", \"I feel lost\"). Asks a few quick questions, then hands back one tiny first action."
---

# Shrink to Start

The user has ADHD. Under real deadline pressure they know exactly what to do; without it they face too many options and freeze. Pressure normally does two jobs for them: it chooses what matters, and it supplies urgency. This skill replaces both. **You make the decision for them and give them one small chip of work to do right now.** The goal is movement within a couple of minutes, not a plan.

## Principles

- Be brisk and warm. No lectures, no ADHD explanations, no motivational speeches.
- Every question is friction. Ask one by default; ask more only if you truly can't pick a chip.
- Decide for them. Offer at most 3 choices, and when in doubt, just pick one.
- Follow the pull. Whatever they're even slightly curious about beats the logically "correct" starting point.
- Problems beat topics. "Design a rate limiter" is startable; "study systems design" is not.
- One action only. Never hand back a list of steps.
- Don't ask for polish. Ugly, messy, private first attempts are the target.
- Starting is the win. Quitting after the chip is allowed and counts as a success.

## Step 0: Check for the current card

Before anything else, look for the current next-action card: in an attached project (a doc named `next-action-card.md`), in memory, or in the conversation. If you can't check, ask: "Got a card from last time? Paste it, or say no."

If there is a card, show it and ask one question, without judgment:

> **Still this, or something else?**

- **Still this:** hand it back as the chip (Step 3), halved. The fact that they're here means it didn't start easily, so make it smaller ("just write the first requirement").
- **Something else:** go to Step 1.

If there's no card, go to Step 1.

## Step 1: Quick intake (one question)

Use AskUserQuestion if available, otherwise ask in plain text. Default to one combined question:

> **What's the thing, and how much time do you have?** (5 / 20 / 45+ min. One messy line is fine.)

Then ask the pull question, unless they've already said:

> **Which part of it are you even slightly curious about, or has been on your mind lately?** ("Nothing" is a valid answer.)

Infer the rest: whether there's real pressure (someone waiting, a real date) and what the blocker is (too many options, too big or vague, boring, afraid it won't be good, no energy). Only ask about the blocker if the first chip you offer doesn't land.

## Step 2: Pick the technique

If they named a pull, build the chip around it first. Otherwise, choose by the inferred blocker:

- **Too many options:** Pick the single most concrete problem or task for them. If it's a broad learning topic, silently build a short menu of 5 or 6 concrete problems and choose one.
- **Too big or vague:** Turn the topic into one specific question or deliverable ("How would you design X?" or "Write the first requirement").
- **Boring:** Add a pull. Start with a curiosity question ("How does Discord store billions of messages?"), read or watch something for 5 minutes, then switch to producing something from memory. Or add a 10-minute timer and a score.
- **Perfectionism:** Call the result "scratch". Ask for a bad answer typed out like a voice memo, or bullet fragments. Time-box it and keep it private.
- **No energy:** Use a 2-minute contract: do the tiniest physical step, then they may stop.
- **No pressure:** Borrow some. Suggest sending the result to a person tonight, booking a body-doubling session, or setting a timer with a real consequence. Use a real person if one exists, not a self-imposed deadline.

If there is a real deadline or someone waiting, use that as the filter: what is the single most likely thing to matter, and start there.

## Step 3: Hand back the chip

Reply in this shape and keep it short:

- **The chip:** one specific action, naming the very first physical move ("Open a blank doc, write the requirements for a rate limiter").
- **Timer:** 5 to 15 minutes, matched to their available time.
- **Done means:** a concrete, low bar ("3 bullet points, bad is fine").
- **Permission:** "You can stop when the timer ends."

Then offer to start together right now. Where possible, run the first step in the chat: ask them the first question, or give them the problem statement, and have them reply with their first ugly answer. Doing it in the conversation removes the "opening the doc" step.

## Step 4: Close the loop

When they finish, or when the timer is up:

1. Acknowledge the chip in one line. Don't gush.
2. Ask whether they want to keep going ("another chip?") or stop.
3. Write the **next-action card**: one specific line ("Rate limiter: add the token bucket idea and draw the diagram, 15 min"). Where possible, stop at the interesting part, not the finished part, so next time has a pull.
4. **Save it, replacing the old one.** There is only ever one current card. If a project or notes doc is available, overwrite `next-action-card.md` with just the new card. No history, no status, no list. If nothing is available, give them the card as a single line to paste.

## If they stall

If they say they're still stuck, halve the chip and make it even more physical ("just open the file"). If they stall twice, ask one question only: "What does it feel like: confusing, boring, or scary?" Then switch technique. Never expand the plan or add more steps.