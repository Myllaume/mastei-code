# Mastei Code - Extension VSCode/VSCodium

Extension VSCode/VSCodium pour souligner automatiquement des séquences de texte spécifiques dans les fichiers YAML.

## Description

Cette extension lit un fichier JSON `underline.json` contenant une liste de séquences de texte à souligner, puis applique un soulignement personnalisable sur ces séquences lorsqu'elles apparaissent dans vos fichiers YAML (comme `fiches.yml`).

L'extension gère correctement les accents et les caractères spéciaux français (é, è, ê, à, ç, etc.).

## Installation

### Méthode 1 : Installation depuis le code source

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/Myllaume/mastei-code.git
   cd mastei-code
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Compilez l'extension :
   ```bash
   npm run compile
   ```

4. Ouvrez le dossier dans VSCode/VSCodium :
   ```bash
   code .
   ```

5. Appuyez sur `F5` pour lancer l'extension en mode développement

### Méthode 2 : Installation via VSIX

1. Compilez l'extension en package VSIX :
   ```bash
   npm install
   npm run compile
   npx vsce package
   ```

2. Installez le fichier `.vsix` généré :
   - Dans VSCode/VSCodium, allez dans Extensions (Ctrl+Shift+X)
   - Cliquez sur "..." en haut à droite
   - Sélectionnez "Install from VSIX..."
   - Choisissez le fichier `mastei-code-0.1.0.vsix`

## Utilisation

1. **Créez un fichier `underline.json`** à la racine de votre workspace :
   ```json
   ["La France et l'Allemagne", "Les français avec des caractères spéciaux"]
   ```

2. **Créez ou ouvrez un fichier YAML** (par exemple `fiches.yml`) :
   ```yaml
   titre: "Exemple"
   contenu: |
     La France et l'Allemagne ont des relations importantes.
     Les français avec des caractères spéciaux sont bien gérés.
   ```

3. **Les séquences seront automatiquement soulignées** dans vos fichiers YAML selon votre configuration.

## Configuration

Vous pouvez personnaliser l'apparence du soulignement dans les paramètres de VSCode :

1. Ouvrez les paramètres (Ctrl+,)
2. Recherchez "Mastei Code"
3. Configurez les options suivantes :

- **Mastei Code: Underline Color** (par défaut : `#FF0000`)
  - Couleur du soulignement en format hexadécimal
  - Exemple : `#FF0000` (rouge), `#0000FF` (bleu), `#00FF00` (vert)

- **Mastei Code: Underline Style** (par défaut : `solid`)
  - Style du soulignement
  - Options : `solid`, `double`, `dotted`, `dashed`, `wavy`

- **Mastei Code: Background Color** (par défaut : vide)
  - Couleur de fond optionnelle pour le texte surligné
  - Exemple : `#FFFF00` (jaune)

### Exemple de configuration dans settings.json :

```json
{
  "masteiCode.underlineColor": "#FF0000",
  "masteiCode.underlineStyle": "wavy",
  "masteiCode.backgroundColor": "#FFFF0033"
}
```

## Fonctionnalités

- ✅ Soulignement automatique de séquences de texte dans les fichiers YAML
- ✅ Support complet des accents et caractères spéciaux français
- ✅ Configuration personnalisable (couleur, style, fond)
- ✅ Mise à jour en temps réel lors de la modification du fichier `underline.json`
- ✅ Rechargement automatique lors de l'édition des fichiers YAML

## Structure du projet

```
mastei-code/
├── src/
│   └── extension.ts        # Code principal de l'extension
├── package.json            # Manifeste de l'extension
├── tsconfig.json          # Configuration TypeScript
├── underline.json         # Fichier de configuration des textes à souligner
├── fiches.yml            # Exemple de fichier YAML
└── README.md             # Ce fichier
```

## Développement

Pour développer ou modifier l'extension :

```bash
# Installer les dépendances
npm install

# Compiler
npm run compile

# Compiler en mode watch (recompilation automatique)
npm run watch

# Linter le code
npm run lint
```

## Exemples

### Exemple 1 : Textes simples

`underline.json` :
```json
["bonjour", "monde"]
```

`test.yml` :
```yaml
message: "bonjour le monde"
```

### Exemple 2 : Textes avec accents

`underline.json` :
```json
["français", "élève", "château"]
```

`test.yml` :
```yaml
cours:
  - "Le français est une belle langue"
  - "L'élève étudie au château"
```

## Licence

MIT

## Auteur

Myllaume