#!/bin/sh
# Construit l'APK release signé de l'admin : `npm run android:apk`.
# Prérequis : JDK 21 et SDK Android. Variables reconnues : JAVA_HOME, ANDROID_HOME.
set -eu

ROOT=$(cd "$(dirname "$0")/.." && pwd)
ANDROID_DIR="$ROOT/android"

: "${JAVA_HOME:=$HOME/jdk21}"
: "${ANDROID_HOME:=$HOME/Android/Sdk}"
export JAVA_HOME ANDROID_HOME
export PATH="$JAVA_HOME/bin:$PATH"

[ -x "$JAVA_HOME/bin/java" ] || { echo "JDK introuvable : définissez JAVA_HOME (JDK 21)." >&2; exit 1; }
[ -d "$ANDROID_HOME/platforms" ] || { echo "SDK Android introuvable : définissez ANDROID_HOME." >&2; exit 1; }
[ -f "$ANDROID_DIR/local.properties" ] || echo "sdk.dir=$ANDROID_HOME" > "$ANDROID_DIR/local.properties"

# Clé de signature créée une seule fois. À SAUVEGARDER : sans elle, impossible d'installer une mise à jour par-dessus.
PROPS="$ANDROID_DIR/keystore.properties"
if [ ! -f "$PROPS" ]; then
  PASS=$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32)
  keytool -genkeypair -v -noprompt \
    -keystore "$ANDROID_DIR/studio-blog-release.jks" -alias studio-blog \
    -keyalg RSA -keysize 4096 -validity 10000 \
    -storepass "$PASS" -keypass "$PASS" \
    -dname "CN=Hassy Tsihoarana, O=Studio blog" >/dev/null
  printf 'storeFile=studio-blog-release.jks\nstorePassword=%s\nkeyAlias=studio-blog\nkeyPassword=%s\n' "$PASS" "$PASS" > "$PROPS"
  chmod 600 "$PROPS" "$ANDROID_DIR/studio-blog-release.jks"
  echo "Clé de signature créée : android/studio-blog-release.jks (+ keystore.properties). Sauvegardez ces deux fichiers."
fi

cd "$ANDROID_DIR"
./gradlew --quiet assembleRelease

mkdir -p "$ROOT/dist-apk"
cp app/build/outputs/apk/release/app-release.apk "$ROOT/dist-apk/studio-blog.apk"
echo "APK prêt : dist-apk/studio-blog.apk ($(du -h "$ROOT/dist-apk/studio-blog.apk" | cut -f1))"
