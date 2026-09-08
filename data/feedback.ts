import type { Feedback } from "@/lib/types";

/**
 * Mock feedback submissions. Every entry belongs to a tester who was accepted
 * to that playtest (see `data/applications.ts`) and only exists for playtests
 * that are in progress, in review, or completed.
 */
export const feedback: Feedback[] = [
  /* ---- pt-6 · Signal Garden (completed) ------------------------------- */
  {
    id: "fb-1",
    playtestId: "pt-6",
    testerId: "tester-5",
    ratings: { fun: 5, difficulty: 3, clarity: 4, performance: 4, polish: 4 },
    sentiment: "positive",
    summary:
      "The asymmetric setup is genuinely special. My partner and I were finishing each other's sentences by puzzle four. Lobbies held sync the whole session on web↔mobile.",
    highlights: [
      "The 'I see mirrors, you see beams' hook lands immediately",
      "Reconnect after I killed wifi was seamless",
    ],
    painPoints: [
      "Puzzle 6 has two valid solutions and the game only accepts one",
      "Mobile player can't tell whose turn it is to place a mirror",
    ],
    bugs: [
      "Once, the mobile client showed a mirror the web client didn't — fixed itself after a move",
    ],
    answers: [
      {
        taskId: "pt-6-t2",
        question: "Which puzzles pushed you to the hint button?",
        answer: "Only puzzle 7. We sat on it for ~9 minutes before caving.",
      },
    ],
    wouldRecommend: true,
    hoursPlayed: 2.5,
    submittedAt: "2026-07-30",
  },
  {
    id: "fb-2",
    playtestId: "pt-6",
    testerId: "tester-6",
    ratings: { fun: 4, difficulty: 3, clarity: 3, performance: 5, polish: 4 },
    sentiment: "positive",
    summary:
      "Strong co-op puzzler. The hint system fired too eagerly for us — it offered a nudge before we'd really engaged with puzzle 3.",
    highlights: ["Cross-platform lobby just worked", "Great difficulty ramp across world 1"],
    painPoints: [
      "First-tier hint appears after only 45s of inactivity — feels patronising",
      "No way to review the previous puzzle's solution",
    ],
    bugs: [],
    answers: [
      {
        taskId: "pt-6-t2",
        question: "Which puzzles pushed you to the hint button?",
        answer: "None voluntarily — the hint offered itself on 3 and 5 before we asked.",
      },
    ],
    wouldRecommend: true,
    hoursPlayed: 1.8,
    submittedAt: "2026-07-29",
  },
  {
    id: "fb-3",
    playtestId: "pt-6",
    testerId: "tester-1",
    ratings: { fun: 4, difficulty: 4, clarity: 4, performance: 4, polish: 3 },
    sentiment: "neutral",
    summary:
      "Solid concept, a bit rough at the edges. Getting a matched partner took three tries before the lobby connected.",
    highlights: ["Puzzle design is clever without being cruel"],
    painPoints: [
      "Matchmaking failed twice with no error message",
      "Text is tiny on a phone held in portrait",
    ],
    bugs: ["Matchmaking spinner never times out — had to restart the app"],
    answers: [
      {
        taskId: "pt-6-t2",
        question: "Which puzzles pushed you to the hint button?",
        answer: "Puzzle 8. The two-screen coordination finally outpaced our communication.",
      },
    ],
    wouldRecommend: true,
    hoursPlayed: 2.1,
    submittedAt: "2026-08-01",
  },
  {
    id: "fb-4",
    playtestId: "pt-6",
    testerId: "tester-4",
    ratings: { fun: 4, difficulty: 3, clarity: 4, performance: 4, polish: 4 },
    sentiment: "positive",
    summary:
      "No desync during the full world-1 run. Filed two minor UI bugs. The hint tiers are well-judged once you actually trigger them yourself.",
    highlights: ["Zero desync across 8 puzzles", "Clean reconnect handling"],
    painPoints: ["Turn indicator is ambiguous on mobile"],
    bugs: [
      "Puzzle 4: beam preview lingers for ~1s after undo",
      "Settings menu closes if the partner places a mirror while it's open",
    ],
    answers: [
      {
        taskId: "pt-6-t1",
        question: "Did you notice any desync?",
        answer: "No. Board state matched on both devices every move I checked.",
      },
    ],
    wouldRecommend: true,
    hoursPlayed: 1.5,
    submittedAt: "2026-08-02",
  },

  /* ---- pt-4 · Understory (in review) --------------------------------- */
  {
    id: "fb-5",
    playtestId: "pt-4",
    testerId: "tester-6",
    ratings: { fun: 4, difficulty: 2, clarity: 2, performance: 5, polish: 4 },
    sentiment: "neutral",
    summary:
      "The sleep-to-grow mechanic did not click until minute 18, when I slept by accident and a vine had grown. Before that I thought I'd hit a dead end and nearly quit twice.",
    highlights: ["Gorgeous, calm atmosphere", "Once it clicked, I felt clever"],
    painPoints: [
      "Nothing signals that sleeping does anything",
      "The first grow-gate looks identical to decorative scenery",
    ],
    bugs: [],
    answers: [
      {
        taskId: "pt-4-t2",
        question: "When did the core mechanic click?",
        answer: "~18 minutes, and only by accident. A one-time visual cue after the first sleep would fix this.",
      },
    ],
    wouldRecommend: true,
    hoursPlayed: 1.0,
    submittedAt: "2026-08-19",
  },
  {
    id: "fb-6",
    playtestId: "pt-4",
    testerId: "tester-5",
    ratings: { fun: 3, difficulty: 2, clarity: 1, performance: 4, polish: 3 },
    sentiment: "negative",
    summary:
      "I spent 30 minutes wandering and never understood what I was supposed to do. On mobile the sleep gesture (long-press) also conflicts with the look-around control.",
    highlights: ["Art direction is lovely"],
    painPoints: [
      "No sense of direction or goal in the opening area",
      "Long-press to sleep collides with camera drag on touch",
      "I assumed the game was broken around minute 12",
    ],
    bugs: ["Long-press sometimes triggers both sleep and a camera spin"],
    answers: [
      {
        taskId: "pt-4-t2",
        question: "When did the core mechanic click?",
        answer: "It didn't. I read the debrief afterwards and finally understood.",
      },
    ],
    wouldRecommend: false,
    hoursPlayed: 0.6,
    submittedAt: "2026-08-20",
  },
  {
    id: "fb-7",
    playtestId: "pt-4",
    testerId: "tester-3",
    ratings: { fun: 4, difficulty: 2, clarity: 3, performance: 5, polish: 4 },
    sentiment: "positive",
    summary:
      "Got it at around minute 9 — I noticed the light changed and a plant looked different, then deliberately slept again. The unguided approach mostly works if you add one soft nudge.",
    highlights: ["The 'aha' is very satisfying", "Pacing of the first area is good"],
    painPoints: ["The very first gate is too subtle", "Easy to walk past the first sleep spot"],
    bugs: [],
    answers: [
      {
        taskId: "pt-4-t2",
        question: "When did the core mechanic click?",
        answer: "Minute 9, semi-deliberately. I'd keep it tutorial-less but make gate #1 unmistakable.",
      },
    ],
    wouldRecommend: true,
    hoursPlayed: 0.9,
    submittedAt: "2026-08-21",
  },

  /* ---- pt-2 · Lantern & Loam (in progress) --------------------------- */
  {
    id: "fb-8",
    playtestId: "pt-2",
    testerId: "tester-2",
    ratings: { fun: 5, difficulty: 4, clarity: 4, performance: 4, polish: 3 },
    sentiment: "positive",
    summary:
      "Ten runs in. The 'Rain Barrel + Compost Tea' combo is busted — infinite water economy by turn 6 in three of my runs. Otherwise the balance is close.",
    highlights: ["Runs land right around 30 minutes", "Blight telegraph is much clearer than last build"],
    painPoints: ["Rain Barrel + Compost Tea trivialises water management", "Late-game plots feel same-y"],
    bugs: ["Seed 44812: watering an empty plot still consumes an action"],
    answers: [
      {
        taskId: "pt-2-t2",
        question: "Describe the most broken deck you found.",
        answer: "Rain Barrel (common) + Compost Tea (uncommon). Online by turn 6, never think about water again.",
      },
    ],
    wouldRecommend: true,
    hoursPlayed: 5.5,
    submittedAt: "2026-09-04",
  },
  {
    id: "fb-9",
    playtestId: "pt-2",
    testerId: "tester-1",
    ratings: { fun: 4, difficulty: 5, clarity: 3, performance: 4, polish: 3 },
    sentiment: "neutral",
    summary:
      "Difficulty is punishing in a good way, but the card tooltips don't explain interaction timing, so my first two runs were lost to rules I didn't know.",
    highlights: ["Genuinely tense final nights", "Card art is charming"],
    painPoints: [
      "Tooltips omit whether effects trigger at dawn or dusk",
      "No run history to learn from losses",
    ],
    bugs: ["Blight counter briefly shows a negative number when cleared on the last tile"],
    answers: [
      {
        taskId: "pt-2-t2",
        question: "Describe the most broken deck you found.",
        answer: "Nothing broken yet — I'm still losing. 'Mulch Wall' feels slightly overtuned defensively.",
      },
    ],
    wouldRecommend: true,
    hoursPlayed: 4.0,
    submittedAt: "2026-09-06",
  },
];
