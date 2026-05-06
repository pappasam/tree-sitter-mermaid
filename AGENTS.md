# AGENTS.md

This is a tolerant, editor-first Tree-sitter grammar for Mermaid.

Before changing behavior, read:

- `README.md` for scope and development basics
- `ARCHITECTURE.md` for parser strategy
- `HIGHLIGHTING.md` before changing captures or named nodes used by queries

Use `grammar.js` as the source of truth, then regenerate checked-in parser artifacts.

Add or update focused corpus examples under `test/corpus/` for grammar changes, and use `examples/all-diagram-types.mmd` to sanity-check highlighting across diagram families.

Run the full local validation with:

```sh
make tests
```

Keep changes diagram-scoped when possible. Prefer named semantic nodes that queries can capture clearly over broad global token matching.
