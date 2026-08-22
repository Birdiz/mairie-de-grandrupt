import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DocumentDownload } from "@/components/ui/DocumentDownload";

const doc = {
  url: "/api/documents/file/pv-2026-03-12.pdf",
  filename: "pv-2026-03-12.pdf",
  filesize: 245_760,
  title: "Procès-verbal du 12 mars 2026",
};

describe("DocumentDownload", () => {
  it("announces the format and weight in the link name (RGAA 13.3)", () => {
    render(<DocumentDownload document={doc} label="Télécharger le procès-verbal" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName("Télécharger le procès-verbal (PDF, 240 Ko)");
  });

  it("points at the file and asks the browser to download it", () => {
    render(<DocumentDownload document={doc} label="Télécharger le document" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", doc.url);
    expect(link).toHaveAttribute("download");
  });

  it("switches to megabytes for large files", () => {
    render(<DocumentDownload document={{ ...doc, filesize: 3_355_443 }} label="Télécharger" />);
    expect(screen.getByRole("link")).toHaveAccessibleName("Télécharger (PDF, 3,2 Mo)");
  });

  it("omits the weight when it is unknown rather than showing '0 Ko'", () => {
    render(<DocumentDownload document={{ ...doc, filesize: null }} label="Télécharger" />);
    expect(screen.getByRole("link")).toHaveAccessibleName("Télécharger (PDF)");
  });
});
