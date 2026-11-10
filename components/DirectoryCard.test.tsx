import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DirectoryCard } from "./DirectoryCard";
import type { CivicTechProject, CivilSocietyOrg } from "@/types/directory";

const sampleProject: { kind: "project" } & CivicTechProject = {
  kind: "project",
  slug: "project-sample",
  name: "Open Sample",
  tagLine: "Sample civic project",
  description: "Detailed description of sample project.",
  sector: "Disaster & Recovery",
  affiliation: "independent",
  tags: ["disaster", "relief"],
  liveUrl: "https://example.org/sample",
  techStack: ["Next.js"],
  license: "MIT",
  maintainer: "Sample Org",
  status: "active",
};

const sampleCso: { kind: "cso" } & CivilSocietyOrg = {
  kind: "cso",
  slug: "cso-sample",
  name: "Civic Action PH",
  sector: "Social & Welfare",
  affiliation: "independent",
  focusAreas: ["poverty relief", "youth welfare"],
  registrationRef: "SEC Reg. No. 12345",
  websiteUrl: "https://example.org/cso",
  contactEmail: "info@example.org",
  regionHeadquarters: "National Capital Region (Quezon City)",
  status: "verified",
};

describe("DirectoryCard", () => {
  it("renders a project with the Civic Tech badge, tagline, and description", () => {
    render(<DirectoryCard entry={sampleProject} />);

    expect(screen.getByText("Civic Tech")).toBeDefined();
    expect(screen.getByText("Sample civic project")).toBeDefined();
    expect(
      screen.getByText("Detailed description of sample project."),
    ).toBeDefined();
    expect(screen.getByText(/sample org/i)).toBeDefined();
    expect(screen.getByText(/mit/i)).toBeDefined();
  });

  it("renders a CSO with the CSO badge, focus areas, and headquarters", () => {
    render(<DirectoryCard entry={sampleCso} />);

    expect(screen.getByText("CSO")).toBeDefined();
    expect(
      screen.getByText(/civil society organization · national capital region/i),
    ).toBeDefined();
    expect(
      screen.getByText(/focus areas: poverty relief, youth welfare\./i),
    ).toBeDefined();
    expect(screen.getByText(/sec reg\. no\. 12345/i)).toBeDefined();
  });
});
