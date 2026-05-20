[
  (subgraph_statement)
  (er_entity_block)
] @indent.begin

[
  (end_statement)
] @indent.end

((unknown_statement) @indent.begin
  (#match? @indent.begin "^[[:space:]]*(loop|rect|opt|alt|par|critical|break|box|section|pipeline)\\b"))

((unknown_statement) @indent.branch
  (#match? @indent.branch "^[[:space:]]*(else|and|option)\\b"))

((unknown_statement) @indent.end
  (#match? @indent.end "^[[:space:]]*end\\b"))
