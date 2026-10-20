#!/usr/bin/env bash
#
# Sauvegarde des données runtime de Payload : base SQLite (volume mairie-data)
# + médias téléversés (volume mairie-media). Produit une archive .tar.gz horodatée.
#
# Usage :   ./scripts/backup.sh [dossier_de_sortie]   (défaut : ./backups)
# Restauration : voir le README (extraire l'archive dans les volumes, puis redémarrer).
#
# Exemple de cron quotidien (3h du matin) :
#   0 3 * * * cd /chemin/vers/app && ./scripts/backup.sh /var/backups/grandrupt >> /var/log/grandrupt-backup.log 2>&1
set -euo pipefail

OUT_DIR="${1:-./backups}"
STAMP="$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUT_DIR"
OUT_ABS="$(cd "$OUT_DIR" && pwd)"

# Les volumes sont préfixés par le nom du projet Compose ; on les retrouve par suffixe.
data_vol="$(docker volume ls -q | grep -E 'mairie-data$' | head -1 || true)"
media_vol="$(docker volume ls -q | grep -E 'mairie-media$' | head -1 || true)"

if [ -z "$data_vol" ]; then
  echo "✗ Volume 'mairie-data' introuvable. Le conteneur a-t-il déjà démarré ?" >&2
  exit 1
fi

archive="grandrupt-backup-$STAMP.tar.gz"
# Conteneur jetable qui monte les volumes en lecture seule et archive leur contenu.
# Les volumes sont montés sous /src, absent de l'image alpine : monté sur un
# chemin existant (ex. /media), un volume vide serait rempli par Docker avec le
# contenu de l'image et sa racine passerait en root, ce qui empêcherait l'app
# (uid 1001) d'y écrire.
docker run --rm \
  -v "$data_vol":/src/data:ro \
  ${media_vol:+-v "$media_vol":/src/media:ro} \
  -v "$OUT_ABS":/backup \
  alpine tar czf "/backup/$archive" -C /src data ${media_vol:+media}

echo "✓ Sauvegarde créée : $OUT_ABS/$archive"
