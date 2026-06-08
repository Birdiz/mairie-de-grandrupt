import * as migration_20260608_104010_initial from "./20260608_104010_initial";

export const migrations = [
  {
    up: migration_20260608_104010_initial.up,
    down: migration_20260608_104010_initial.down,
    name: "20260608_104010_initial",
  },
];
