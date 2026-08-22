import * as migration_20260608_104010_initial from "./20260608_104010_initial.ts";
import * as migration_20260822_100446_pv_documents from "./20260822_100446_pv_documents.ts";

export const migrations = [
  {
    up: migration_20260608_104010_initial.up,
    down: migration_20260608_104010_initial.down,
    name: "20260608_104010_initial",
  },
  {
    up: migration_20260822_100446_pv_documents.up,
    down: migration_20260822_100446_pv_documents.down,
    name: "20260822_100446_pv_documents",
  },
];
