# Architecture

We evaluated <https://github.com/monaqa/tree-sitter-mermaid> and chose not to fork it. The difference was architectural, not cosmetic: that project is a stricter grammar for a smaller Mermaid subset, while this project is a tolerant, editor-first grammar for broad Mermaid coverage.

Forking would have meant reshaping the parser strategy, highlight model, and coverage assumptions. Starting from this architecture was simpler.

## Direction

This project prioritizes:

- broad diagram recognition
- recoverable parsing for unknown or newer syntax
- diagram-scoped body rules
- consistent semantic highlight captures; see [HIGHLIGHTING.md](HIGHLIGHTING.md)
- incremental structure as diagram support matures

The rejected alternative prioritizes deeper parsing for a smaller set of older diagram families.

## Tradeoff

This grammar uses three fallback layers:

- structured diagrams parse known headers and known body statements
- baseline diagrams parse recognized headers while leaving body lines recoverable
- `unknown_statement` preserves unknown lines without breaking nearby syntax

That is the right tradeoff for editor tooling: highlighting, folding, indentation, and navigation should keep working even when Mermaid changes faster than the grammar.

When adding support, prefer diagram-scoped rules, named semantic nodes, and focused corpus examples over global token matching.
