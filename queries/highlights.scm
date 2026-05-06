(diagram_type) @type
(direction) @constant

[
  "title"
  "accTitle"
  "accDescr"
] @keyword

(accessibility_description_statement block: (brace_text) @string)

(directive) @attribute
(comment) @comment
(frontmatter) @preproc

[
  "direction"
  "subgraph"
  "end"
  "classDef"
  "class"
  "state"
  "note"
  "for"
  "style"
  "linkStyle"
  "interpolate"
  "click"
  "href"
  "call"
] @keyword

(flow_node id: (identifier) @variable)
(standalone_flow_node id: (identifier) @variable)
(class_def_statement name: (identifier) @type)
(class_statement
  targets: (identifier_list (identifier) @variable)
  class_name: (identifier) @type)
(style_statement target: (identifier) @variable)
(link_style_statement target: (_) @number)
(click_statement target: (identifier) @variable)
(subgraph_statement id: (identifier) @namespace)

(class_annotation
  ":::" @punctuation.special
  name: (identifier) @type)

(style_property
  name: (style_property_name) @property
  ":" @punctuation.delimiter
  value: (style_value) @string.special)

(flow_edge operator: (arrow) @operator)
(flow_edge
  operator: (arrow_start) @operator
  operator_end: (arrow) @operator)
(edge_id id: (identifier) @label)
(edge_label text: (_) @string)

(shape_data) @attribute

[
  "["
  "]"
  "("
  ")"
  "{"
  "}"
  "[["
  "]]"
  "(("
  "))"
  "((("
  ")))"
  "(["
  "])"
  "[("
  ")]"
  "{{"
  "}}"
  "[/"
  "/]"
  "[\\"
  "\\]"
  ">"
] @punctuation.bracket

[
  "group"
  "service"
  "junction"
  "in"
  "complex"
  "complicated"
  "clear"
  "chaotic"
  "confusion"
  "places"
  "contains"
  "entity"
  "data"
  "dateFormat"
  "section"
  "after"
  "gwt"
  "tf"
  "timeframe"
  "rf"
  "resetframe"
  "commit"
  "branch"
  "merge"
  "checkout"
  "switch"
  "cherry-pick"
  "showInfo"
  "showData"
  "axis"
  "curve"
  "showLegend"
  "ticks"
  "max"
  "min"
  "graticule"
  "size"
  "evolution"
  "anchor"
  "component"
  "label"
  "evolve"
  "pipeline"
  "note"
  "annotations"
  "annotation"
  "accelerator"
  "deaccelerator"
] @keyword

(architecture_group_statement id: (identifier) @namespace)
(architecture_service_statement id: (identifier) @variable)
(architecture_junction_statement id: (identifier) @variable)
(architecture_edge_statement
  source: (identifier) @variable
  edge: (architecture_arrow) @operator
  target: (identifier) @variable)

(architecture_icon) @attribute
(architecture_group_marker) @attribute
(architecture_title) @string

(class_note_statement
  target: (identifier) @type)
(class_note_text "\"" @string)
(class_note_text_fragment) @string

(class_relationship_statement
  source: (identifier) @type
  operator: (class_relationship_operator) @operator
  target: (identifier) @type)

(class_member_statement class: (identifier) @type)
(class_block name: (identifier) @type)
(class_entity_statement name: (identifier) @type)
(class_member visibility: (class_visibility) @operator)
(class_member type: (identifier) @type)
(class_member name: (identifier) @property)
(class_member
  name: (identifier) @function
  parameters: (class_parameter_list))

(er_relationship_statement
  source: (identifier) @type
  relationship: (er_relationship_label) @keyword
  target: (identifier) @type)

(er_attribute_statement
  entity: (identifier) @type
  attribute: (identifier) @property)

(gantt_date_format_statement format: (gantt_date_format) @string.special)
(gantt_section_statement name: (gantt_section_name) @namespace)
(gantt_task_statement label: (gantt_task_label) @string)
(gantt_task_statement status: (gantt_task_status) @keyword)
(gantt_task_statement id: (identifier) @label)
(gantt_task_statement date: (gantt_date) @number)
(gantt_task_statement duration: (gantt_duration) @number)
(gantt_task_statement dependency: (identifier) @label)

(git_option value: (_) @string)

(journey_section_statement name: (journey_section_name) @namespace)
(journey_task_statement label: (journey_task_label) @string)
(journey_task_statement score: (number) @number)
(journey_task_statement actor: (identifier) @variable)

(packet_statement label: (quoted_string) @string)

(pie_statement
  label: (quoted_string) @string
  value: (number) @number)

(radar_axis name: (identifier) @variable)
(radar_curve name: (identifier) @function)
(radar_option value: (_) @constant)

(sequence_message_statement
  source: (sequence_actor) @variable
  arrow: (sequence_arrow) @operator
  target: (sequence_actor) @variable
  message: (sequence_message_text) @string)

(sequence_autonumber_keyword) @keyword
(sequence_loop_keyword) @keyword
(sequence_note_keyword) @keyword
(sequence_of_keyword) @keyword
(sequence_loop_statement label: (sequence_message_text) @string)
(sequence_note_statement
  position: (sequence_note_position) @keyword
  target: (sequence_actor_list (sequence_actor) @variable)
  message: (sequence_message_text) @string)

(state_declaration_statement name: (identifier) @type)
(state_marker) @constant
(state_transition_statement source: (identifier) @type)
(state_transition_statement target: (identifier) @type)
(state_transition_statement label: (state_transition_label) @string)
(state_transition_statement
  arrow: (state_arrow) @operator)

(tree_item_statement name: (quoted_string) @string)
(tree_icon_annotation) @attribute
(tree_description_annotation) @comment

(quoted_string) @string
(number) @number
(boolean) @boolean
(label_text_fragment) @string
(html_tag) @tag

[
  ":"
  ","
  ";"
  "@"
  "|"
] @punctuation.delimiter

(generic_statement) @none
