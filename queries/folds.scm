(subgraph_statement) @fold
(er_entity_block) @fold

((unknown_statement) @fold
  (#match? @fold "^[[:space:]]*(loop|rect|opt|alt|par|critical|break|box|section|pipeline)\\b"))
