import * as migration_20260608_104010_initial from "./20260608_104010_initial";
import * as migration_20260822_100446_pv_documents from "./20260822_100446_pv_documents";
import * as migration_20261020_092847_payload_3_91 from "./20261020_092847_payload_3_91";
import * as migration_20261020_191749_actualites_localized from "./20261020_191749_actualites_localized.ts";

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
  {
    up: migration_20261020_191749_actualites_localized.up,
    down: migration_20261020_191749_actualites_localized.down,
    name: "20261020_191749_actualites_localized",
  },
];
