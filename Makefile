TREE_SITTER_CONFIG := tree-sitter.config.json
EXAMPLE_MERMAID := examples/all-diagram-types.mmd

.PHONY: tests
tests:
	npm run generate
	npm test
	tree-sitter parse --quiet --config-path $(TREE_SITTER_CONFIG) $(EXAMPLE_MERMAID)
	tree-sitter query --config-path $(TREE_SITTER_CONFIG) queries/highlights.scm $(EXAMPLE_MERMAID) >/dev/null
	tree-sitter query --config-path $(TREE_SITTER_CONFIG) queries/injections.scm $(EXAMPLE_MERMAID) >/dev/null
	tree-sitter query --config-path $(TREE_SITTER_CONFIG) queries/folds.scm $(EXAMPLE_MERMAID) >/dev/null
	tree-sitter query --config-path $(TREE_SITTER_CONFIG) queries/indents.scm $(EXAMPLE_MERMAID) >/dev/null
