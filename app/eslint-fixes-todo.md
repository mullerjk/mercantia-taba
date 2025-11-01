# ESLint Fixes TODO List

## Critical Errors (Compilation Blocking)
- [ ] Fix schema-explorer-modal.tsx: Conditional useState hook call
- [ ] Fix input.tsx: Empty interface declaration
- [ ] Fix label.tsx: Empty interface declaration

## Type Issues (@typescript-eslint/no-explicit-any)
- [ ] Fix settings/page.tsx (lines 95, 179)
- [ ] Fix auto-renderer.tsx (lines 24, 55)
- [ ] Fix entity-navigator.tsx (line 10)
- [ ] Fix schema-explorer-tree.tsx (lines 87, 95, 104, 145, 157, 171)
- [ ] Fix mock-schemas.ts (line 13)
- [ ] Fix utils.ts (lines 20, 91, 111, 112)

## Unused Variables/Imports
- [ ] Fix demo-magicui/page.tsx: Unused 'Image' import
- [ ] Fix settings/page.tsx: Unused 'Download' and 'Upload' imports
- [ ] Fix dock-navigation.tsx: Unused 'e' parameter
- [ ] Fix auto-renderer.tsx: Unused Avatar components and Marquee import
- [ ] Fix entity-navigator.tsx: Unused 'entities' parameter
- [ ] Fix file-tree.tsx: Multiple unused refs and variables
- [ ] Fix schema-explorer-tree.tsx: Unused imports and 'err' parameter

## React Hooks Issues
- [ ] Fix file-tree.tsx: Missing dependencies in useCallback hooks
- [ ] Fix schema-explorer-tree.tsx: Missing dependency in useEffect

## React Component Issues
- [ ] Fix schema-explorer-tree.tsx: Unescaped entities in quotes

## Summary
- Total files to fix: 8
- Critical errors: 3
- Type errors: 13
- Unused variables: 15+
- React hooks: 3
- React components: 1
