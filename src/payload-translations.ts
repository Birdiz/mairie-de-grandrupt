/**
 * Overrides of Payload's French admin translations.
 *
 * The stock strings hedge on grammatical gender because `{{label}}` can be any
 * collection or field name: « Créer un(e) nouveau ou nouvelle {{label}} »,
 * « Créé(e) », « de ou du {{label}} »… They read badly for the mairie's staff.
 * These replacements are phrased so they hold whatever the label's gender
 * (« Actualité », « Document », « Média », « Utilisateur »). Payload deep-merges
 * them over its own `fr` translations, so only the keys listed here change.
 */
export const frOverrides = {
  fields: {
    addNew: "Ajouter",
    addNewLabel: "Ajouter : {{label}}",
    chooseFromExisting: "Choisir parmi les éléments existants",
    chooseLabel: "Choisir : {{label}}",
    editLabelData: "Modifier les données : {{label}}",
    labelRelationship: "Relation : {{label}}",
    newLabel: "Nouvel élément : {{label}}",
    uploadNewLabel: "Téléverser un nouveau fichier",
  },
  general: {
    aboutToDelete:
      "Vous êtes sur le point de supprimer <1>{{title}}</1> ({{label}}). Voulez-vous continuer ?",
    aboutToRestore:
      "Vous êtes sur le point de restaurer <1>{{title}}</1> ({{label}}). Voulez-vous continuer ?",
    aboutToRestoreAsDraft:
      "Vous êtes sur le point de restaurer <1>{{title}}</1> ({{label}}) en tant que brouillon. Voulez-vous continuer ?",
    ascending: "Croissant",
    created: "Création",
    createdAt: "Créé le",
    createNew: "Créer",
    createNewLabel: "Créer : {{label}}",
    creatingNewLabel: "Nouvel élément : {{label}}",
    deletedCountSuccessfully: "Suppression effectuée : {{count}} {{label}}.",
    deletedSuccessfully: "Suppression effectuée.",
    descending: "Décroissant",
    noLabel: "<Sans {{label}}>",
    none: "Aucun",
    noResults:
      "Aucun résultat : rien n’a encore été créé dans « {{label}} », ou rien ne correspond aux filtres ci-dessus.",
    perPage: "Par page : {{limit}}",
    successfullyCreated: "{{label}} : création effectuée.",
    successfullyDuplicated: "{{label}} : duplication effectuée.",
    titleDeleted: "Suppression de « {{title}} » ({{label}}) effectuée.",
  },
  version: {
    noRowsFound: "Aucun résultat dans « {{label}} »",
    restoredSuccessfully: "Restauration effectuée.",
    viewingVersion: "Version de « {{documentTitle}} » ({{entityLabel}})",
    viewingVersions: "Versions de « {{documentTitle}} » ({{entityLabel}})",
  },
};
