# tree-sitter-mermaid

A tolerant Tree-sitter grammar for Mermaid diagrams.

The parser is designed for editor tooling first: highlighting, navigation, folding, and indentation should keep working when a diagram contains newer or partially-supported Mermaid syntax. Stable statement families are parsed with structure, baseline diagrams are recognized by header, and unknown lines remain as `unknown_statement` nodes instead of poisoning the whole tree.

Project scope: this grammar aims to provide structured support for Mermaid diagram types that are not experimental in Mermaid itself. Experimental diagram types may be recognized and kept recoverable, but they should be expected to receive only baseline parsing and highlighting until they stabilize upstream.

## Design

- Common Mermaid frontmatter, directives, comments, titles, and accessibility statements are shared across diagram types.
- Flowchart statements have explicit structure for headers, directions, subgraphs, node/edge chains, `classDef`, `class`, `style`, `linkStyle`, and `click`.
- Mermaid's current Langium-backed parser package is represented for `info`, `packet`, `pie`, `architecture-beta`, `gitGraph`, `eventmodeling`, `radar-beta`, `treemap`, `treeView-beta`, `wardley-beta`, and `cynefin-beta`.
- Older broad Jison dialects such as sequence, class, state, ER, Gantt, journey, C4, mindmap, kanban, block, timeline, quadrant, and requirement diagrams are recognized and kept recoverable even where their internal syntax is still line-oriented.

## Development

```sh
npm run generate
npm test
```

Neovim can consume the generated `src/parser.c` and the `queries/` directory.
