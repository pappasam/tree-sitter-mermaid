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

## Usage in Neovim

Neovim's treesitter ecosystem was upended on April 3rd, 2026 when [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) was [archived](https://github.com/nvim-treesitter/nvim-treesitter/discussions/8627#discussioncomment-16440673). That said, as of May 6, 2026, there is no clear alternative for parser installation / query management. [neovim-treesitter](https://github.com/neovim-treesitter) is one org trying to step in, but it hasn't reached a level of traction that would make me conclude its role as successor. So, for the time being, I'm just going to continue using `nvim-treesitter`; it's not broken.

To use this specific parser for `mermaid`, add the following to your `init.lua`:

```lua
vim.api.nvim_create_autocmd("User", {
  pattern = "TSUpdate",
  callback = function()
    local parsers = require("nvim-treesitter.parsers")
    parsers.mermaid = {
      ---@diagnostic disable-next-line: missing-fields
      install_info = {
        url = "https://github.com/pappasam/tree-sitter-mermaid",
        queries = "queries",
      },
      tier = 4,
    }
  end,
})
```

When you run `:TSUpdate`, your editor will install and use this parser for mermaid. You'll also need to call `vim.treesitter.start()` within your mermaid file. I do this with a `ftplugin`:

```lua
-- ftplugin/mermaid.lua
vim.bo.commentstring = "%% %s"
vim.bo.comments = ":%%"
vim.bo.indentexpr = "v:lua.require'nvim-treesitter'.indentexpr()"
vim.treesitter.start()
```
