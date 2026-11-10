import { describe, expect, it } from "vitest";
import { moderatorApprovers, requiredApprovals } from "./quorum";

describe("requiredApprovals", () => {
  it("needs one approval for independent and international Listings", () => {
    expect(requiredApprovals(["independent"])).toBe(1);
    expect(requiredApprovals(["international", "independent"])).toBe(1);
  });

  it("needs two when any changed Listing is run by BetterGov or government", () => {
    expect(requiredApprovals(["bettergov"])).toBe(2);
    expect(requiredApprovals(["independent", "government"])).toBe(2);
  });

  it("needs one for a removal, which changes no affiliations", () => {
    expect(requiredApprovals([])).toBe(1);
  });
});

describe("moderatorApprovers", () => {
  const moderators = ["Ana", "ben", "carla"];

  it("counts only people on the Moderator list", () => {
    const reviews = [
      { user: "ana", state: "APPROVED" },
      { user: "stranger", state: "APPROVED" },
    ];
    expect(moderatorApprovers(reviews, moderators, "dev")).toEqual(["ana"]);
  });

  it("uses each person's latest review, so a later change request cancels an approval", () => {
    const reviews = [
      { user: "ana", state: "APPROVED" },
      { user: "ana", state: "CHANGES_REQUESTED" },
      { user: "ben", state: "CHANGES_REQUESTED" },
      { user: "ben", state: "APPROVED" },
    ];
    expect(moderatorApprovers(reviews, moderators, "dev")).toEqual(["ben"]);
  });

  it("ignores a dismissed approval", () => {
    const reviews = [
      { user: "ana", state: "APPROVED" },
      { user: "ana", state: "DISMISSED" },
    ];
    expect(moderatorApprovers(reviews, moderators, "dev")).toEqual([]);
  });

  it("does not let a comment undo an approval", () => {
    const reviews = [
      { user: "ana", state: "APPROVED" },
      { user: "ana", state: "COMMENTED" },
    ];
    expect(moderatorApprovers(reviews, moderators, "dev")).toEqual(["ana"]);
  });

  it("never counts the author's own approval", () => {
    const reviews = [{ user: "Ana", state: "APPROVED" }];
    expect(moderatorApprovers(reviews, moderators, "ana")).toEqual([]);
  });
});
