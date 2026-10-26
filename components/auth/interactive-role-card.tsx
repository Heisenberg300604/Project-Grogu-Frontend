"use client";

import React from "react";
import { Check, Gamepad2, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: "tester" | "developer";
  active: boolean;
  onSelect: () => void;
}

const ROLE_DATA = {
  tester: {
    icon: UserRound,
    badge: "Playtester",
    title: "Test Games & Provide Feedback",
    description: "Discover unreleased games, test build mechanics, and earn a reputation as a trusted playtester.",
    features: [
      "Access early-stage builds & indie titles",
      "Submit structured bugs & surveys",
      "Build your gaming profile & badges",
    ],
    accentColor: "from-primary/20 to-transparent border-primary/50 text-secondary",
  },
  developer: {
    icon: Gamepad2,
    badge: "Developer",
    title: "Run Playtests & Recruit Players",
    description: "Launch playtest runs, recruit targeted gamers, and gain actionable feedback to refine your game.",
    features: [
      "Target playtesters by genre & hardware",
      "Manage playtest applications & access",
      "Analyze survey & quantitative reports",
    ],
    accentColor: "from-secondary/20 to-transparent border-secondary/50 text-secondary",
  },
};

export function InteractiveRoleCard({ role, active, onSelect }: RoleCardProps) {
  const data = ROLE_DATA[role];
  const Icon = data.icon;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      aria-pressed={active}
      className={cn(
        "relative flex flex-col justify-between rounded-xl border-2 border-line p-5 text-left transition-[background-color,box-shadow] duration-300",
        active
          ? "bg-primary-soft shadow-md"
          : "bg-surface hover:bg-elevated"
      )}
    >
      {/* Radio checkmark circle indicator */}
      <div className="absolute top-4 right-4 flex items-center justify-center">
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200",
            active
              ? "border-line bg-primary text-primary-foreground scale-110 shadow-sm"
              : "border-line bg-surface text-transparent"
          )}
        >
          <Check className="size-3.5 stroke-[3]" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Header with Icon and Badge */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-lg border-2 transition-colors",
              active
                ? "border-line bg-primary text-primary-foreground"
                : "border-line bg-elevated text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <span
              className={cn(
                "hud inline-flex items-center gap-1 rounded-full border-2 border-line px-2.5 py-1 text-[0.62rem]",
                active
                  ? "bg-grape text-white"
                  : "bg-elevated text-muted-foreground"
              )}
            >
              <Sparkles className="size-3" />
              {data.badge}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-display text-lg font-extrabold leading-tight text-foreground">
            {data.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {data.description}
          </p>
        </div>

        {/* Key Features Bullet List */}
        <ul className="space-y-2 pt-2 border-t-2 border-dashed border-border text-xs">
          {data.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-subtle-foreground">
              <ShieldCheck
                className={cn(
                  "size-3.5 shrink-0",
                  active ? "text-secondary" : "text-muted-foreground/70"
                )}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.button>
  );
}
