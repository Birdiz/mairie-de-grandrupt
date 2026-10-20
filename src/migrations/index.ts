import * as migration_20260608_104010_initial from "./20260608_104010_initial.ts";
import * as migration_20260822_100446_pv_documents from "./20260822_100446_pv_documents.ts";
import * as migration_20261020_092847_payload_3_91 from "./20261020_092847_payload_3_91.ts";

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
  {
    up: migration_20261020_092847_payload_3_91.up,
    down: migration_20261020_092847_payload_3_91.down,
    name: "20261020_092847_payload_3_91",
  },
];
