# Translation Validation System

This directory contains scripts to ensure translation file consistency across all supported languages.

## Scripts

### `validate-translations.js`

Validates all translation files against the English reference to ensure:
- **Structural consistency**: All files have the same JSON structure
- **Complete translations**: No missing translation keys
- **No empty values**: All translation strings are properly filled
- **No extra keys**: No unnecessary keys that don't exist in the reference

## Usage

### Manual Validation

```bash
# Run validation manually
npm run validate-translations

# The script will exit with code 0 if all translations are valid
# or code 1 if there are issues
```

### Automatic Validation

- **Pre-build**: Validation runs automatically before every build (`npm run build`)
- **GitHub Actions**: Validation runs on every push/PR that changes translation files
- **Pre-commit hook**: (Optional) Add to your git hooks for immediate feedback

## Example Output

### ✅ All Valid
```
🌍 Atraves Translation Validator

Found 12 locales: de, en, es, fr, it, ja, ko, nl, pt, ru, sw, zh

Loading reference locale (en)...
✓ Reference has 79 keys

Validating de...
✓ de: Perfect! No issues found
...

📊 VALIDATION SUMMARY
═════════════════════
🎉 ALL TRANSLATIONS VALID!
All 11 translation files are structurally consistent with the reference.
```

### ❌ Issues Found
```
❌ Found 4 total issues across 2 locales

Issues in fr:
  Missing 2 keys:
    - footer.title
    - footer.subtitle

Issues in de:
  Empty 1 values:
    ∅ header.subtitle
```

## Adding New Languages

1. Copy the English translation file: `src/locales/en/translation.json`
2. Create new directory: `src/locales/[language-code]/`
3. Translate all values (keep keys the same)
4. Run `npm run validate-translations` to verify

## Fixing Issues

- **Missing keys**: Add the missing translation keys with proper translations
- **Extra keys**: Remove keys that don't exist in the English reference
- **Empty values**: Fill in the empty translation strings
- **Structure issues**: Ensure nested objects match the English file structure

## Best Practices

- Always use the English file as your structural reference
- Test your translations by running the app in different languages
- Keep translations culturally appropriate and contextually accurate
- Use the same level of formality/tone across all languages