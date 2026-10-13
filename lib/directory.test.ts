import { describe, expect, it } from "vitest";
import {
  EMPTY_STUDIO_FILTERS,
  EMPTY_TESTER_FILTERS,
  joinStudios,
  joinTesters,
  matchesStudioFilters,
  matchesTesterFilters,
  sortStudios,
  sortTesters,
  type StudioDirectoryEntry,
  type TesterDirectoryEntry,
} from "@/lib/domain";
import {
  makeDeveloperProfile,
  makeTesterProfile,
  makeUser,
} from "@/lib/testing/factories";
import type { DeveloperProfile, TesterProfile } from "@/lib/types";

function tester(
  id: string,
  name: string,
  profile: Partial<TesterProfile> = {},
  user: Partial<Parameters<typeof makeUser>[0]> = {},
): TesterDirectoryEntry {
  return {
    user: makeUser({
      id,
      name,
      handle: name.toLowerCase().replace(/\s/g, ""),
      role: "tester",
      location: "Lisbon, PT",
      bio: "",
      ...user,
    }),
    profile: makeTesterProfile({ userId: id, ...profile }),
  };
}

function studio(
  id: string,
  studioName: string,
  profile: Partial<DeveloperProfile> = {},
): StudioDirectoryEntry {
  return {
    user: makeUser({ id, name: `${studioName} lead`, role: "developer" }),
    profile: makeDeveloperProfile({ userId: id, studioName, ...profile }),
  };
}

describe("joinTesters / joinStudios", () => {
  it("pairs profiles with users of the right role", () => {
    const users = [
      makeUser({ id: "1", role: "tester" }),
      makeUser({ id: "2", role: "developer" }),
    ];
    const testers = joinTesters(users, [
      makeTesterProfile({ userId: "1" }),
      makeTesterProfile({ userId: "2" }),
    ]);
    expect(testers.map((t) => t.user.id)).toEqual(["1"]);

    const studios = joinStudios(users, [
      makeDeveloperProfile({ userId: "1" }),
      makeDeveloperProfile({ userId: "2" }),
    ]);
    expect(studios.map((s) => s.user.id)).toEqual(["2"]);
  });

  it("drops profiles whose user is missing", () => {
    expect(joinTesters([], [makeTesterProfile({ userId: "9" })])).toEqual([]);
    expect(joinStudios([], [makeDeveloperProfile({ userId: "9" })])).toEqual([]);
  });
});

describe("matchesTesterFilters", () => {
  const amara = tester(
    "1",
    "Amara Osei",
    {
      experienceLevel: "hardcore",
      platforms: ["pc", "console"],
      preferredGenres: ["rpg", "strategy"],
    },
    { location: "Accra, GH", bio: "Turn-based and RPG player." },
  );

  it("matches everything with empty filters", () => {
    expect(matchesTesterFilters(amara, EMPTY_TESTER_FILTERS)).toBe(true);
  });

  it("searches name, location and bio case-insensitively", () => {
    const f = EMPTY_TESTER_FILTERS;
    expect(matchesTesterFilters(amara, { ...f, search: "AMARA" })).toBe(true);
    expect(matchesTesterFilters(amara, { ...f, search: "accra" })).toBe(true);
    expect(matchesTesterFilters(amara, { ...f, search: "turn-based" })).toBe(
      true,
    );
    expect(matchesTesterFilters(amara, { ...f, search: "nobody" })).toBe(false);
  });

  it("filters by experience, platform and genre", () => {
    const f = EMPTY_TESTER_FILTERS;
    expect(
      matchesTesterFilters(amara, { ...f, experience: ["hardcore"] }),
    ).toBe(true);
    expect(matchesTesterFilters(amara, { ...f, experience: ["casual"] })).toBe(
      false,
    );
    expect(matchesTesterFilters(amara, { ...f, platforms: ["mobile"] })).toBe(
      false,
    );
    expect(matchesTesterFilters(amara, { ...f, platforms: ["console"] })).toBe(
      true,
    );
    expect(matchesTesterFilters(amara, { ...f, genres: ["horror"] })).toBe(
      false,
    );
  });

  it("requires every filter group to match", () => {
    expect(
      matchesTesterFilters(amara, {
        ...EMPTY_TESTER_FILTERS,
        experience: ["hardcore"],
        genres: ["horror"],
      }),
    ).toBe(false);
  });
});

describe("sortTesters", () => {
  const list = [
    tester("1", "Bea", { reputation: 60, completedPlaytests: 9, weeklyAvailabilityHours: 4 }),
    tester("2", "Al", { reputation: 90, completedPlaytests: 2, weeklyAvailabilityHours: 12 }),
    tester("3", "Cy", { reputation: 60, completedPlaytests: 5, weeklyAvailabilityHours: 8 }),
  ];
  const names = (sorted: TesterDirectoryEntry[]) =>
    sorted.map((e) => e.user.name);

  it("sorts by reputation, breaking ties by name", () => {
    expect(names(sortTesters(list, "reputation"))).toEqual(["Al", "Bea", "Cy"]);
  });

  it("sorts by completed playtests and availability", () => {
    expect(names(sortTesters(list, "completed"))).toEqual(["Bea", "Cy", "Al"]);
    expect(names(sortTesters(list, "availability"))).toEqual(["Al", "Cy", "Bea"]);
  });

  it("sorts by name and never mutates its input", () => {
    const before = names(list);
    expect(names(sortTesters(list, "name"))).toEqual(["Al", "Bea", "Cy"]);
    expect(names(list)).toEqual(before);
  });
});

describe("matchesStudioFilters", () => {
  const ember = studio("1", "Ember Forge Studio", { studioSize: "small" });

  it("matches studio name and lead name", () => {
    const f = EMPTY_STUDIO_FILTERS;
    expect(matchesStudioFilters(ember, { ...f, search: "ember" })).toBe(true);
    expect(matchesStudioFilters(ember, { ...f, search: "forge studio lead" })).toBe(
      true,
    );
    expect(matchesStudioFilters(ember, { ...f, search: "tidewater" })).toBe(
      false,
    );
  });

  it("filters by studio size", () => {
    const f = EMPTY_STUDIO_FILTERS;
    expect(matchesStudioFilters(ember, { ...f, sizes: ["small", "mid"] })).toBe(
      true,
    );
    expect(matchesStudioFilters(ember, { ...f, sizes: ["solo"] })).toBe(false);
  });
});

describe("sortStudios", () => {
  const list = [
    studio("1", "Beta", { activePlaytests: 1, gamesPublished: 5, foundedYear: 2014 }),
    studio("2", "Alpha", { activePlaytests: 3, gamesPublished: 1, foundedYear: 2022 }),
    studio("3", "Gamma", { activePlaytests: 3, gamesPublished: 2, foundedYear: 2019 }),
  ];
  const names = (sorted: StudioDirectoryEntry[]) =>
    sorted.map((e) => e.profile.studioName);

  it("sorts by active playtests, breaking ties by name", () => {
    expect(names(sortStudios(list, "active"))).toEqual(["Alpha", "Gamma", "Beta"]);
  });

  it("sorts by games and newest founding year", () => {
    expect(names(sortStudios(list, "games"))).toEqual(["Beta", "Gamma", "Alpha"]);
    expect(names(sortStudios(list, "founded"))).toEqual(["Alpha", "Gamma", "Beta"]);
  });

  it("sorts by name", () => {
    expect(names(sortStudios(list, "name"))).toEqual(["Alpha", "Beta", "Gamma"]);
  });
});
