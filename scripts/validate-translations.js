#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const REFERENCE_LOCALE = 'en';

/**
 * Recursively get all keys from a nested object
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys.sort();
}

/**
 * Load and parse a translation file
 */
function loadTranslationFile(locale) {
  try {
    const filePath = path.join(LOCALES_DIR, locale, 'translation.json');
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load ${locale}: ${error.message}`);
  }
}

/**
 * Get all available locales
 */
function getAvailableLocales() {
  try {
    return fs.readdirSync(LOCALES_DIR)
      .filter(item => {
        const fullPath = path.join(LOCALES_DIR, item);
        return fs.statSync(fullPath).isDirectory();
      })
      .sort();
  } catch (error) {
    throw new Error(`Failed to read locales directory: ${error.message}`);
  }
}

/**
 * Validate a single translation file against reference
 */
function validateTranslation(locale, translation, referenceKeys) {
  const issues = [];
  const translationKeys = getAllKeys(translation);
  
  // Check for missing keys
  const missingKeys = referenceKeys.filter(key => !translationKeys.includes(key));
  if (missingKeys.length > 0) {
    issues.push({
      type: 'missing',
      count: missingKeys.length,
      keys: missingKeys
    });
  }
  
  // Check for extra keys
  const extraKeys = translationKeys.filter(key => !referenceKeys.includes(key));
  if (extraKeys.length > 0) {
    issues.push({
      type: 'extra',
      count: extraKeys.length,
      keys: extraKeys
    });
  }
  
  // Check for empty values
  const emptyKeys = [];
  function checkEmpty(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string' && value.trim() === '') {
        emptyKeys.push(fullKey);
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        checkEmpty(value, fullKey);
      }
    }
  }
  checkEmpty(translation);
  
  if (emptyKeys.length > 0) {
    issues.push({
      type: 'empty',
      count: emptyKeys.length,
      keys: emptyKeys
    });
  }
  
  return issues;
}

/**
 * Main validation function
 */
function validateTranslations() {
  console.log(`${colors.bold}${colors.cyan}🌍 Atraves Translation Validator${colors.reset}\n`);
  
  try {
    // Get all locales
    const locales = getAvailableLocales();
    console.log(`${colors.blue}Found ${locales.length} locales:${colors.reset} ${locales.join(', ')}\n`);
    
    // Load reference translation
    if (!locales.includes(REFERENCE_LOCALE)) {
      throw new Error(`Reference locale '${REFERENCE_LOCALE}' not found`);
    }
    
    console.log(`${colors.magenta}Loading reference locale (${REFERENCE_LOCALE})...${colors.reset}`);
    const referenceTranslation = loadTranslationFile(REFERENCE_LOCALE);
    const referenceKeys = getAllKeys(referenceTranslation);
    console.log(`${colors.green}✓ Reference has ${referenceKeys.length} keys${colors.reset}\n`);
    
    // Validate each locale
    let totalIssues = 0;
    const results = [];
    
    for (const locale of locales) {
      if (locale === REFERENCE_LOCALE) continue;
      
      console.log(`${colors.yellow}Validating ${locale}...${colors.reset}`);
      
      try {
        const translation = loadTranslationFile(locale);
        const issues = validateTranslation(locale, translation, referenceKeys);
        
        results.push({ locale, issues });
        
        if (issues.length === 0) {
          console.log(`${colors.green}✓ ${locale}: Perfect! No issues found${colors.reset}`);
        } else {
          const issueCount = issues.reduce((sum, issue) => sum + issue.count, 0);
          totalIssues += issueCount;
          console.log(`${colors.red}✗ ${locale}: ${issueCount} issues found${colors.reset}`);
        }
      } catch (error) {
        console.log(`${colors.red}✗ ${locale}: ${error.message}${colors.reset}`);
        totalIssues++;
      }
    }
    
    // Summary report
    console.log(`\n${colors.bold}${colors.cyan}📊 VALIDATION SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}═════════════════════${colors.reset}`);
    
    if (totalIssues === 0) {
      console.log(`${colors.green}${colors.bold}🎉 ALL TRANSLATIONS VALID!${colors.reset}`);
      console.log(`${colors.green}All ${locales.length - 1} translation files are structurally consistent with the reference.${colors.reset}`);
      return true;
    }
    
    console.log(`${colors.red}${colors.bold}❌ Found ${totalIssues} total issues across ${results.filter(r => r.issues.length > 0).length} locales${colors.reset}\n`);
    
    // Detailed issue report
    for (const { locale, issues } of results) {
      if (issues.length === 0) continue;
      
      console.log(`${colors.bold}${colors.red}Issues in ${locale}:${colors.reset}`);
      
      for (const issue of issues) {
        switch (issue.type) {
          case 'missing':
            console.log(`  ${colors.red}Missing ${issue.count} keys:${colors.reset}`);
            issue.keys.slice(0, 5).forEach(key => console.log(`    - ${key}`));
            if (issue.keys.length > 5) {
              console.log(`    ... and ${issue.keys.length - 5} more`);
            }
            break;
            
          case 'extra':
            console.log(`  ${colors.yellow}Extra ${issue.count} keys:${colors.reset}`);
            issue.keys.slice(0, 5).forEach(key => console.log(`    + ${key}`));
            if (issue.keys.length > 5) {
              console.log(`    ... and ${issue.keys.length - 5} more`);
            }
            break;
            
          case 'empty':
            console.log(`  ${colors.yellow}Empty ${issue.count} values:${colors.reset}`);
            issue.keys.slice(0, 5).forEach(key => console.log(`    ∅ ${key}`));
            if (issue.keys.length > 5) {
              console.log(`    ... and ${issue.keys.length - 5} more`);
            }
            break;
        }
      }
      console.log();
    }
    
    console.log(`${colors.yellow}💡 Fix these issues to ensure all users get a complete experience!${colors.reset}`);
    return false;
    
  } catch (error) {
    console.error(`${colors.red}${colors.bold}Fatal error: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run validation
const isValid = validateTranslations();
process.exit(isValid ? 0 : 1);