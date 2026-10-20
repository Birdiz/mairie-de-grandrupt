import { describe, it, expect } from "vitest";
import fr from "@/i18n/messages/fr.json";
import en from "@/i18n/messages/en.json";
import de from "@/i18n/messages/de.json";

type Messages = { [key: string]: string | Messages };

function flattenKeys(messages: Messages, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === "object" ? flattenKeys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

const frKeys = flattenKeys(fr).sort();

describe.each([
  ["en", en],
  ["de", de],
])("messages %s.json", (_locale, messages) => {
  it("a exactement les mêmes clés que fr.json", () => {
    expect(flattenKeys(messages).sort()).toEqual(frKeys);
  });
});
