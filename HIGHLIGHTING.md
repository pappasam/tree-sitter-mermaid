# Highlighting

Highlight captures should describe Mermaid concepts consistently across diagram types.

## Capture Contract

- `@type`: diagram kinds and named model types, such as classes, ER entities, and states
- `@keyword`: Mermaid commands, relationship words, block delimiters, and reserved options
- `@variable`: user-defined instances or references, such as node IDs, actors, branches, and points
- `@property`: property/config keys and member/property names
- `@function`: callable members or callback-like names
- `@label`: explicit labels or stable identifiers attached to edges, tasks, commits, or requirements
- `@namespace`: grouping scopes, sections, and containers
- `@string`: labels, prose, quoted strings, and display text
- `@string.special`: style values and other string-like values with special syntax
- `@number`: numeric values, dates, durations, scores, and coordinates
- `@constant`: fixed enum-like values that are not commands
- `@boolean`: boolean literals
- `@operator`: arrows, relationship operators, visibility markers, and other structural operators
- `@attribute`: annotations, directives, icons, and metadata
- `@tag`: inline HTML tags inside Mermaid labels
- `@comment`: Mermaid comments and comment-like annotations
- `@preproc`: frontmatter delimiters; frontmatter content is injected as YAML
- `@punctuation.*`: delimiters, brackets, and special punctuation

## Guidelines

Prefer the semantic role over the spelling. The same word can receive different captures in different contexts if its role changes.

Use `@type` for domain types and declarations; use `@variable` for references to concrete instances. For example, a class name is `@type`, while a flowchart node ID is `@variable`.

Use `@property` for keys and named fields, not for arbitrary identifiers. If a value is user-defined and referenced elsewhere, prefer `@variable` or `@label`.

Use `@string` for display text even when Mermaid does not require quotes. This keeps labels, prose, and titles visually consistent.

Use `@constant` sparingly for fixed values such as directions, state markers, or quadrant numbers. Do not use it for section names or user-authored labels.

When adding a diagram, add grammar nodes that make these roles queryable. Avoid broad text regex captures when a named node would make the semantic role clear.
