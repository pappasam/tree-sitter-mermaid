const PREC = {
  generic: -10,
  remainder: -5,
  flow_statement: 2,
};

const typeChoice = (types) => (types.length === 1 ? types[0] : choice(...types));
const bodyItem = ($, rule) => choice(prec(1, seq($.indentation, rule)), rule);

const diagramDefinitions = [
  {
    name: 'architecture',
    types: ['architecture-beta'],
    statements: ($) => [$.architecture_statement],
    topLevelStatements: ($) => [$.architecture_statement],
  },
  {name: 'block', types: ['block', 'block-beta'], support: 'baseline'},
  {name: 'c4', types: ['c4', 'C4Component', 'C4Container', 'C4Context', 'C4Deployment'], support: 'baseline'},
  {
    name: 'class',
    types: ['classDiagram', 'classDiagram-v2'],
    statements: ($) => [
      choice(
        $.class_note_statement,
        $.class_relationship_statement,
        $.class_member_statement,
        $.class_block,
        $.class_entity_statement,
      ),
    ],
  },
  {
    name: 'cynefin',
    types: ['cynefin-beta'],
    statements: ($) => [$.cynefin_statement],
    topLevelStatements: ($) => [$.cynefin_statement],
  },
  {
    name: 'er',
    types: ['erDiagram'],
    statements: ($) => [choice($.er_relationship_statement, $.er_attribute_statement)],
  },
  {
    name: 'event_modeling',
    types: ['eventmodeling'],
    statements: ($) => [$.event_modeling_statement],
    topLevelStatements: ($) => [$.event_modeling_statement],
  },
  {
    name: 'flow',
    types: ['flowchart', 'flowchart-elk', 'flowchart-v2', 'graph'],
    header: {direction: true},
    statements: ($) => [$.flow_statement],
    topLevelStatements: ($) => [$.flow_statement],
  },
  {
    name: 'gantt',
    types: ['gantt'],
    statements: ($) => [
      choice(
        $.gantt_date_format_statement,
        $.gantt_section_statement,
        $.gantt_task_statement,
      ),
    ],
  },
  {
    name: 'git_graph',
    types: ['gitGraph'],
    header: {direction: true},
    statements: ($) => [$.git_graph_statement],
    topLevelStatements: ($) => [$.git_graph_statement],
  },
  {
    name: 'info',
    types: ['info'],
    statements: ($) => [$.info_statement],
    topLevelStatements: ($) => [$.info_statement],
  },
  {
    name: 'journey',
    types: ['journey'],
    statements: ($) => [choice($.journey_section_statement, $.journey_task_statement)],
  },
  {name: 'kanban', types: ['kanban', 'kanban-beta'], support: 'baseline'},
  {
    name: 'mindmap',
    types: ['mindmap'],
    statements: ($) => [$.mindmap_statement],
  },
  {
    name: 'packet',
    types: ['packet', 'packet-beta'],
    statements: ($) => [$.packet_statement],
    topLevelStatements: ($) => [$.packet_statement],
  },
  {
    name: 'pie',
    types: ['pie'],
    header: {showData: true},
    statements: ($) => [$.pie_statement],
    topLevelStatements: ($) => [$.pie_statement],
  },
  {
    name: 'quadrant',
    types: ['quadrantChart'],
    statements: ($) => [$.quadrant_axis_statement, $.quadrant_section_statement, $.quadrant_point_statement],
  },
  {
    name: 'radar',
    types: ['radar-beta'],
    statements: ($) => [$.radar_statement],
    topLevelStatements: ($) => [$.radar_statement],
  },
  {
    name: 'requirement',
    types: ['requirementDiagram'],
    statements: ($) => [$.requirement_statement],
  },
  {
    name: 'sequence',
    types: ['sequenceDiagram'],
    statements: ($) => [
      choice(
        $.sequence_autonumber_statement,
        $.sequence_loop_statement,
        $.sequence_note_statement,
        $.sequence_message_statement,
        $.end_statement,
      ),
    ],
  },
  {
    name: 'state',
    types: ['stateDiagram', 'stateDiagram-v2'],
    statements: ($) => [
      choice(
        $.flow_direction_statement,
        $.class_def_statement,
        $.class_statement,
        $.state_declaration_statement,
        $.state_transition_statement,
      ),
    ],
  },
  {
    name: 'timeline',
    types: ['timeline'],
    statements: ($) => [$.timeline_statement],
  },
  {
    name: 'tree',
    types: ['treeView-beta'],
    statements: ($) => [$.tree_statement],
    indentStatements: false,
    topLevelStatements: ($) => [$.tree_statement],
  },
  {name: 'treemap', types: ['treemap', 'treemap-beta'], support: 'baseline'},
  {
    name: 'wardley',
    types: ['wardley-beta'],
    statements: ($) => [$.wardley_statement],
    topLevelStatements: ($) => [$.wardley_statement],
  },
  {name: 'xychart', types: ['xychart-beta'], support: 'baseline'},
  {name: 'zenuml', types: ['zenuml'], support: 'baseline'},
];

const diagramParseOrder = [
  'flow',
  'architecture',
  'class',
  'cynefin',
  'er',
  'event_modeling',
  'gantt',
  'git_graph',
  'info',
  'journey',
  'mindmap',
  'packet',
  'pie',
  'quadrant',
  'radar',
  'requirement',
  'sequence',
  'state',
  'timeline',
  'tree',
  'wardley',
];

const scopedDiagramDefinitions = diagramParseOrder.map((name) =>
  diagramDefinitions.find((definition) => definition.name === name)
);
const diagramTypes = diagramDefinitions.flatMap((definition) => definition.types);
const genericDiagramTypes = diagramDefinitions
  .filter((definition) => definition.support === 'baseline')
  .flatMap((definition) => definition.types);

const diagramRuleName = (definition) => `${definition.name}_diagram`;
const diagramHeaderRuleName = (definition) => `${definition.name}_diagram_header`;
const diagramItemRuleName = (definition) => `_${definition.name}_diagram_item`;
const diagramTypeRuleName = (definition) => `${definition.name}_diagram_type`;

const diagramHeader = ($, typeRule, options = {}) =>
  seq(
    field('type', alias(typeRule, $.diagram_type)),
    ...(options.direction ? [optional(field('direction', $.direction))] : []),
    ...(options.showData ? [optional('showData')] : []),
    optional(':'),
    $._terminator,
  );

const diagramItem = ($, definition) => {
  const statementRules = definition.statements($);
  const bodyRules = definition.indentStatements === false
    ? statementRules
    : statementRules.map((rule) => bodyItem($, rule));

  return choice(
    $.directive,
    $.comment,
    bodyItem($, $.common_statement),
    ...bodyRules,
    $._terminator,
  );
};

const diagramRules = Object.fromEntries(scopedDiagramDefinitions.flatMap((definition) => [
  [
    diagramRuleName(definition),
    ($) => prec.right(seq($[diagramHeaderRuleName(definition)], repeat($[diagramItemRuleName(definition)]))),
  ],
  [
    diagramHeaderRuleName(definition),
    ($) => diagramHeader($, $[diagramTypeRuleName(definition)], definition.header),
  ],
  [
    diagramTypeRuleName(definition),
    (_) => token(prec(20, typeChoice(definition.types))),
  ],
  [
    diagramItemRuleName(definition),
    ($) => diagramItem($, definition),
  ],
]));

const topLevelStatementRules = ($) =>
  scopedDiagramDefinitions.flatMap((definition) => {
    if (!definition.topLevelStatements) return [];

    return definition.topLevelStatements($).map((rule) =>
      definition.indentStatements === false ? rule : bodyItem($, rule)
    );
  });

module.exports = grammar({
  name: 'mermaid',

  extras: ($) => [/[ \t\f]+/],

  word: ($) => $.identifier,

  conflicts: ($) => [
    [$.event_modeling_statement, $.wardley_keyword_statement],
    [$.standalone_flow_node, $.flow_node],
    [$.generic_statement, $.flow_node],
  ],

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) =>
      choice(
        $.frontmatter,
        $.directive,
        $.comment,
        $.diagram,
        bodyItem($, $.common_statement),
        ...topLevelStatementRules($),
        $.generic_statement,
        $._terminator,
      ),

    diagram: ($) =>
      choice(
        ...scopedDiagramDefinitions.map((definition) => $[diagramRuleName(definition)]),
        $.generic_diagram,
      ),

    frontmatter: (_) => token(/---[\s\S]*---/),

    directive: (_) => token(seq('%%{', /[^%]*(%+[^}%][^%]*)*/, '}%%')),

    comment: (_) => token(seq('%%', /[^\n\r]*/)),

    diagram_type: (_) => token(prec(20, typeChoice(diagramTypes))),

    ...diagramRules,

    generic_diagram: ($) => $.generic_diagram_header,

    generic_diagram_header: ($) =>
      seq(
        field('type', alias($.generic_diagram_type, $.diagram_type)),
        optional(choice(field('direction', $.direction), 'showData')),
        optional(':'),
        $._terminator,
      ),

    generic_diagram_type: (_) => token(prec(20, typeChoice(genericDiagramTypes))),

    direction: (_) => choice('TB', 'TD', 'BT', 'RL', 'LR', 'BR', '<', '>', '^', 'v'),

    common_statement: ($) =>
      choice(
        $.title_statement,
        $.accessibility_title_statement,
        $.accessibility_description_statement,
      ),

    title_statement: ($) => seq('title', optional(':'), optional(field('text', alias($._line_remainder, $.line_text))), $._terminator),

    accessibility_title_statement: ($) =>
      seq('accTitle', ':', optional(field('text', alias($._line_remainder, $.line_text))), $._terminator),

    accessibility_description_statement: ($) =>
      seq(
        'accDescr',
        choice(
          seq(':', optional(field('text', alias($._line_remainder, $.line_text)))),
          field('block', $.brace_text),
        ),
        $._terminator,
      ),

    flow_statement: ($) =>
      choice(
        $.flow_direction_statement,
        $.subgraph_statement,
        $.end_statement,
        $.class_def_statement,
        $.class_statement,
        $.style_statement,
        $.link_style_statement,
        $.click_statement,
        $.flow_edge_statement,
        $.flow_node_statement,
      ),

    sequence_message_statement: ($) =>
      prec(5, seq(
        field('source', $.sequence_actor),
        field('arrow', $.sequence_arrow),
        field('target', $.sequence_actor),
        optional(seq(':', field('message', optional($.sequence_message_text)))),
        $._terminator,
      )),

    sequence_autonumber_statement: ($) => seq($.sequence_autonumber_keyword, $._terminator),

    sequence_loop_statement: ($) =>
      seq($.sequence_loop_keyword, field('label', optional($.sequence_message_text)), $._terminator),

    sequence_note_statement: ($) =>
      seq(
        $.sequence_note_keyword,
        field('position', $.sequence_note_position),
        $.sequence_of_keyword,
        field('target', $.sequence_actor_list),
        ':',
        field('message', optional($.sequence_message_text)),
        $._terminator,
      ),

    sequence_autonumber_keyword: (_) => token(prec(5, 'autonumber')),

    sequence_loop_keyword: (_) => token(prec(5, 'loop')),

    sequence_note_keyword: (_) => token(prec(5, 'Note')),

    sequence_of_keyword: (_) => token(prec(5, 'of')),

    sequence_note_position: (_) => choice('left', 'right', 'over'),

    sequence_actor_list: ($) => seq($.sequence_actor, repeat(seq(',', $.sequence_actor))),

    sequence_actor: ($) => $.identifier,

    sequence_arrow: (_) =>
      choice(
        '<<->>',
        '<<-->>',
        '->>',
        '-->>',
        '-x',
        '--x',
        '-)',
        '--)',
      ),

    sequence_message_text: (_) => token(prec(PREC.remainder, /[^ \t\f\n\r;][^\n\r;]*/)),

    state_declaration_statement: ($) =>
      seq('state', field('name', $.identifier), $._terminator),

    state_transition_statement: ($) =>
      seq(
        field('source', choice($.state_marker, $.identifier)),
        field('arrow', $.state_arrow),
        field('target', choice($.state_marker, $.identifier)),
        optional(seq(':', field('label', optional($.state_transition_label)))),
        $._terminator,
      ),

    state_marker: (_) => token('[*]'),

    state_arrow: (_) => choice('-->', '->'),

    state_transition_label: (_) => token(prec(PREC.remainder, /[^ \t\f\n\r;][^\n\r;]*/)),

    flow_direction_statement: ($) => seq('direction', field('direction', $.direction), $._terminator),

    subgraph_statement: ($) =>
      seq(
        'subgraph',
        optional(field('id', $.identifier)),
        optional(field('label', choice($.square_label, $.quoted_string, $._line_remainder))),
        $._terminator,
      ),

    end_statement: ($) => seq('end', $._terminator),

    class_def_statement: ($) =>
      seq(
        'classDef',
        field('name', $.identifier),
        optional($.style_list),
        $._terminator,
      ),

    class_statement: ($) =>
      seq(
        'class',
        field('targets', $.identifier_list),
        field('class_name', $.identifier),
        $._terminator,
      ),

    style_statement: ($) =>
      seq(
        'style',
        field('target', $.identifier),
        optional($.style_list),
        $._terminator,
      ),

    link_style_statement: ($) =>
      seq(
        'linkStyle',
        field('target', choice('default', $.number_list)),
        optional(seq('interpolate', field('interpolation', $.identifier))),
        optional($.style_list),
        $._terminator,
      ),

    click_statement: ($) =>
      seq(
        'click',
        field('target', $.identifier),
        optional(choice($.href_action, $.call_action, field('callback', $.identifier), $.quoted_string)),
        optional($.quoted_string),
        optional(field('link_target', choice('_self', '_blank', '_parent', '_top'))),
        $._terminator,
      ),

    href_action: ($) => seq('href', field('url', $.quoted_string)),

    call_action: ($) =>
      seq(
        optional('call'),
        field('function', $.identifier),
        field('arguments', $.argument_list),
      ),

    flow_edge_statement: ($) =>
      prec(PREC.flow_statement, seq(
        field('source', $.flow_node),
        repeat1(seq(field('edge', $.flow_edge), field('target', $.flow_node))),
        $._terminator,
      )),

    flow_node_statement: ($) => prec(PREC.flow_statement, seq($.standalone_flow_node, $._terminator)),

    standalone_flow_node: ($) =>
      seq(
        field('id', $.identifier),
        choice(
          field('shape', $.flow_shape),
          $.shape_data,
          $.class_annotation,
        ),
        repeat(choice(field('shape', $.flow_shape), $.shape_data, $.class_annotation)),
      ),

    flow_node: ($) =>
      seq(
        field('id', $.identifier),
        optional(field('shape', $.flow_shape)),
        optional($.shape_data),
        optional($.class_annotation),
      ),

    flow_shape: ($) =>
      choice(
        $.square_label,
        $.round_label,
        $.circle_label,
        $.stadium_label,
        $.subroutine_label,
        $.cylinder_label,
        $.diamond_label,
        $.hexagon_label,
        $.trapezoid_label,
        $.lean_right_label,
        $.lean_left_label,
        $.double_circle_label,
      ),

    square_label: ($) => seq('[', field('text', optional($.label_text)), ']'),
    round_label: ($) => seq('(', field('text', optional($.label_text)), ')'),
    circle_label: ($) => seq('((', field('text', optional($.label_text)), '))'),
    stadium_label: ($) => seq('([', field('text', optional($.label_text)), '])'),
    subroutine_label: ($) => seq('[[', field('text', optional($.label_text)), ']]'),
    cylinder_label: ($) => seq('[(', field('text', optional($.label_text)), ')]'),
    diamond_label: ($) => seq('{', field('text', optional($.label_text)), '}'),
    hexagon_label: ($) => seq('{{', field('text', optional($.label_text)), '}}'),
    trapezoid_label: ($) => seq('[/', field('text', optional($.label_text)), '/]'),
    lean_right_label: ($) => seq('[/', field('text', optional($.label_text)), '\\]'),
    lean_left_label: ($) => seq('[\\', field('text', optional($.label_text)), '/]'),
    double_circle_label: ($) => seq('(((', field('text', optional($.label_text)), ')))'),

    flow_edge: ($) =>
      choice(
        seq(optional($.edge_id), field('operator', $.arrow), optional($.edge_label)),
        seq(optional($.edge_id), field('operator', $.arrow_start), optional($.edge_label), field('operator_end', $.arrow)),
      ),

    edge_id: ($) => seq(field('id', $.identifier), '@'),

    edge_label: ($) => seq('|', field('text', optional($.label_text)), '|'),

    arrow_start: (_) => token(/[ox<]?(--+|==+|-?\.+)/),

    arrow: (_) => token(/[ox<]?((--+|==+|-?\.+-)[-ox>]?|~~~+)/),

    class_annotation: ($) => seq(':::', field('name', $.identifier)),

    shape_data: ($) => seq('@', $.brace_text),

    style_list: ($) => repeat1(seq($.style_property, optional(','))),

    style_property: ($) =>
      seq(
        field('name', $.style_property_name),
        ':',
        field('value', $.style_value),
      ),

    style_property_name: (_) => token(/[A-Za-z_-][A-Za-z0-9_-]*/),

    style_value: (_) => token(prec(PREC.remainder, /[^,\n\r;]+/)),

    architecture_statement: ($) =>
      choice(
        $.architecture_group_statement,
        $.architecture_service_statement,
        $.architecture_junction_statement,
        $.architecture_edge_statement,
      ),

    architecture_group_statement: ($) =>
      seq(
        'group',
        field('id', $.identifier),
        optional(field('icon', $.architecture_icon)),
        optional(field('label', $.architecture_title)),
        optional(seq('in', field('parent', $.identifier))),
        $._terminator,
      ),

    architecture_service_statement: ($) =>
      seq(
        'service',
        field('id', $.identifier),
        optional(choice(field('icon_text', $.quoted_string), field('icon', $.architecture_icon))),
        optional(field('label', $.architecture_title)),
        optional(seq('in', field('parent', $.identifier))),
        $._terminator,
      ),

    architecture_junction_statement: ($) =>
      seq('junction', field('id', $.identifier), optional(seq('in', field('parent', $.identifier))), $._terminator),

    architecture_edge_statement: ($) =>
      seq(
        field('source', $.identifier),
        optional($.architecture_group_marker),
        field('edge', $.architecture_arrow),
        field('target', $.identifier),
        optional($.architecture_group_marker),
        $._terminator,
      ),

    architecture_arrow: (_) => token(/:?[LRTB]?[<>]?--(?:[^-\n\r;]+-)?[<>]?[LRTB]?:?/),
    architecture_group_marker: (_) => token('{group}'),
    architecture_icon: (_) => token(/\([\w:-]+\)/),
    architecture_title: ($) => seq('[', choice($.quoted_string, $.label_text), ']'),

    class_note_statement: ($) =>
      seq(
        'note',
        optional(seq('for', field('target', $.identifier))),
        field('text', $.class_note_text),
        $._terminator,
      ),

    class_note_text: ($) => seq('"', optional($.class_note_label), '"'),

    class_note_label: ($) => repeat1(choice($.html_tag, $.class_note_text_fragment)),

    class_note_text_fragment: (_) => token(prec(PREC.remainder, /[^<"\n\r;]+|</)),

    class_relationship_statement: ($) =>
      seq(
        field('source', $.identifier),
        field('operator', $.class_relationship_operator),
        field('target', $.identifier),
        optional(seq(':', field('label', $._line_remainder))),
        $._terminator,
      ),

    class_relationship_operator: (_) => token(/<\|--|<\|\.\.|\*--|o--|-->|<--|--|\.\./),

    class_member_statement: ($) =>
      seq(
        field('class', $.identifier),
        ':',
        field('member', $.class_member),
        $._terminator,
      ),

    class_block: ($) =>
      seq(
        'class',
        field('name', $.identifier),
        '{',
        $._terminator,
        repeat(choice($.class_block_member_statement, $.comment, $._terminator)),
        '}',
        $._terminator,
      ),

    class_block_member_statement: ($) => seq(field('member', $.class_member), $._terminator),

    class_member: ($) =>
      seq(
        optional(field('visibility', $.class_visibility)),
        choice(
          seq(field('type', $.identifier), field('name', $.identifier), optional(field('parameters', $.class_parameter_list))),
          seq(field('name', $.identifier), optional(field('parameters', $.class_parameter_list))),
        ),
      ),

    class_visibility: (_) => choice('+', '-', '#', '~'),

    class_parameter_list: ($) => seq('(', optional(token(/[^)\n\r]*/)), ')'),

    class_entity_statement: ($) =>
      seq(optional('class'), field('name', $.identifier), $._terminator),

    cynefin_statement: ($) =>
      choice(
        seq(field('domain', $.cynefin_domain), $._terminator),
        seq(field('from', $.cynefin_domain), '-->', field('to', $.cynefin_domain), optional(seq(':', field('label', $.quoted_string))), $._terminator),
      ),

    cynefin_domain: (_) => choice('complex', 'complicated', 'clear', 'chaotic', 'confusion'),

    er_relationship_statement: ($) =>
      seq(
        field('source', $.identifier),
        field('relationship', $.er_relationship_label),
        field('target', $.identifier),
        $._terminator,
      ),

    er_relationship_label: (_) =>
      choice(
        'places',
        'contains',
        'owns',
        'has',
        'includes',
        'uses',
      ),

    er_attribute_statement: ($) =>
      seq(
        field('entity', $.identifier),
        repeat1(field('attribute', $.identifier)),
        $._terminator,
      ),

    event_modeling_statement: ($) =>
      seq(
        field('keyword', choice('entity', 'data', 'note', 'gwt', 'tf', 'timeframe', 'rf', 'resetframe')),
        optional($._line_remainder),
        $._terminator,
      ),

    gantt_date_format_statement: ($) =>
      seq('dateFormat', field('format', $.gantt_date_format), $._terminator),

    gantt_date_format: (_) => token(/[A-Za-z0-9_:/.-]+/),

    gantt_section_statement: ($) =>
      seq('section', field('name', optional($.gantt_section_name)), $._terminator),

    gantt_section_name: (_) => token(prec(PREC.remainder, /[^ \t\f\n\r;][^\n\r;]*/)),

    gantt_task_statement: ($) =>
      seq(
        field('label', $.gantt_task_label),
        field('status', $.gantt_task_status),
        optional(field('id', $.identifier)),
        repeat(choice(field('date', $.gantt_date), field('duration', $.gantt_duration), seq('after', field('dependency', $.identifier)))),
        $._terminator,
      ),

    gantt_task_label: ($) => repeat1($.identifier),

    gantt_task_status: (_) => choice('active', 'crit', 'done', 'milestone'),

    gantt_date: (_) => token(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),

    gantt_duration: (_) => token(/[0-9]+[dhms]/),

    git_graph_statement: ($) =>
      choice(
        seq('commit', repeat(choice($.git_option, $.quoted_string)), $._terminator),
        seq('branch', field('name', choice($.identifier, $.quoted_string)), optional($.git_option), $._terminator),
        seq('merge', field('branch', choice($.identifier, $.quoted_string)), repeat($.git_option), $._terminator),
        seq(choice('checkout', 'switch'), field('branch', choice($.identifier, $.quoted_string)), $._terminator),
        seq('cherry-pick', repeat($.git_option), $._terminator),
      ),

    git_option: ($) =>
      seq(
        field('name', $.git_option_name),
        ':',
        field('value', choice($.quoted_string, $.identifier, $.number)),
      ),

    git_option_name: (_) => choice('id', 'msg', 'tag', 'type', 'order', 'parent'),

    info_statement: ($) => seq('showInfo', $._terminator),

    journey_section_statement: ($) =>
      seq('section', field('name', optional($.journey_section_name)), $._terminator),

    journey_section_name: (_) => token(prec(PREC.remainder, /[^ \t\f\n\r;][^\n\r;]*/)),

    journey_task_statement: ($) =>
      seq(
        field('label', $.journey_task_label),
        optional(':'),
        field('score', $.number),
        optional(':'),
        repeat1(field('actor', $.identifier)),
        $._terminator,
      ),

    journey_task_label: ($) => repeat1($.identifier),

    mindmap_statement: ($) =>
      choice(
        $.mindmap_node_statement,
        $.mindmap_icon_statement,
      ),

    mindmap_node_statement: ($) =>
      seq(
        optional($.mindmap_root_keyword),
        field('label', choice(
          $.mindmap_circle_label,
          $.mindmap_square_label,
          $.mindmap_round_label,
          $.mindmap_plain_label,
        )),
        $._terminator,
      ),

    mindmap_root_keyword: (_) => token(prec(2, 'root')),

    mindmap_circle_label: ($) => seq('((' , field('text', optional($.mindmap_label)), '))'),

    mindmap_square_label: ($) => seq('[', field('text', optional($.mindmap_label)), ']'),

    mindmap_round_label: ($) => seq('(', field('text', optional($.mindmap_label)), ')'),

    mindmap_plain_label: ($) => $.mindmap_label,

    mindmap_label: ($) => repeat1(choice($.html_tag, $.mindmap_label_fragment)),

    mindmap_label_fragment: (_) => token(prec(1, /[^<\[\]\(\)\n\r;]+|</)),

    mindmap_icon_statement: ($) =>
      seq(
        $.mindmap_icon_marker,
        '(',
        field('name', $.mindmap_icon_name),
        ')',
        $._terminator,
      ),

    mindmap_icon_marker: (_) => token(prec(3, '::icon')),

    mindmap_icon_name: (_) => token(/[^)\n\r;]+/),

    packet_statement: ($) =>
      seq(
        field('range', choice(seq($.number, optional(seq('-', $.number))), seq('+', $.number))),
        ':',
        field('label', $.quoted_string),
        $._terminator,
      ),

    pie_statement: ($) =>
      choice(
        seq('showData', $._terminator),
        seq(field('label', $.quoted_string), ':', field('value', $.number), $._terminator),
      ),

    quadrant_axis_statement: ($) =>
      seq(
        field('axis', $.quadrant_axis_name),
        field('from', $.quadrant_axis_text),
        $.quadrant_axis_arrow,
        field('to', $.quadrant_axis_text),
        $._terminator,
      ),

    quadrant_axis_name: (_) => choice('x-axis', 'y-axis'),

    quadrant_axis_arrow: (_) => '-->',

    quadrant_section_statement: ($) =>
      seq(
        'quadrant',
        '-',
        field('number', $.number),
        field('label', optional($.quadrant_text)),
        $._terminator,
      ),

    quadrant_point_statement: ($) =>
      seq(
        field('label', $.quadrant_point_label),
        ':',
        '[',
        field('x', $.number),
        ',',
        field('y', $.number),
        ']',
        $._terminator,
      ),

    quadrant_point_label: ($) => repeat1($.identifier),

    quadrant_axis_text: (_) => token(prec(PREC.remainder, /[^ \t\f\n\r;\[\],:-][^-\n\r;\[\],:]*/)),

    quadrant_text: (_) => token(prec(PREC.remainder, /[^ \t\f\n\r;\[\],:][^\n\r;\[\],:]*/)),

    radar_statement: ($) =>
      choice(
        seq('axis', $.radar_axis, repeat(seq(',', $.radar_axis)), $._terminator),
        seq('curve', $.radar_curve, repeat(seq(',', $.radar_curve)), $._terminator),
        seq($.radar_option, repeat(seq(',', $.radar_option)), $._terminator),
      ),

    radar_axis: ($) => seq(field('name', $.identifier), optional(field('label', $.square_label))),

    radar_curve: ($) => seq(field('name', $.identifier), optional(field('label', $.square_label)), $.brace_text),

    radar_option: ($) =>
      seq(
        field('name', $.radar_option_name),
        field('value', choice($.boolean, $.number, 'circle', 'polygon')),
      ),

    radar_option_name: (_) => choice('showLegend', 'ticks', 'max', 'min', 'graticule'),

    requirement_statement: ($) =>
      choice(
        $.requirement_block,
        $.requirement_relationship_statement,
      ),

    requirement_block: ($) =>
      seq(
        field('kind', $.requirement_kind),
        field('name', $.identifier),
        '{',
        $._terminator,
        repeat(choice(bodyItem($, $.requirement_property_statement), $.comment, $._terminator)),
        bodyItem($, '}'),
        $._terminator,
      ),

    requirement_kind: (_) =>
      choice(
        'requirement',
        'functionalRequirement',
        'performanceRequirement',
        'interfaceRequirement',
        'physicalRequirement',
        'designConstraint',
        'element',
      ),

    requirement_property_statement: ($) =>
      seq(
        field('name', $.requirement_property_name),
        ':',
        field('value', choice($.quoted_string, $.requirement_id, $.requirement_property_value)),
        $._terminator,
      ),

    requirement_property_name: (_) =>
      choice('id', 'text', 'risk', 'verifymethod', 'type', 'docRef'),

    requirement_id: (_) => token(/[0-9]+(?:\.[0-9]+)*/),

    requirement_property_value: (_) => token(prec(PREC.remainder, /[^ \t\f\n\r;][^\n\r;]*/)),

    requirement_relationship_statement: ($) =>
      seq(
        field('source', $.identifier),
        field('operator', $.requirement_relationship_operator),
        field('relationship', $.requirement_relationship_type),
        field('operator', $.requirement_relationship_operator),
        field('target', $.identifier),
        $._terminator,
      ),

    requirement_relationship_operator: (_) => choice('-', '->', '<-'),

    requirement_relationship_type: (_) =>
      choice('contains', 'copies', 'derives', 'refines', 'satisfies', 'traces', 'verifies'),

    timeline_statement: ($) =>
      choice(
        $.timeline_section_statement,
        $.timeline_event_statement,
      ),

    timeline_section_statement: ($) =>
      seq('section', field('name', optional($.timeline_section_name)), $._terminator),

    timeline_section_name: (_) => token(prec(PREC.remainder, /[^ \t\f\n\r;][^\n\r;]*/)),

    timeline_event_statement: ($) =>
      seq(
        optional(field('time', $.timeline_time)),
        ':',
        field('text', optional($.timeline_text)),
        $._terminator,
      ),

    timeline_time: (_) => token(/[0-9]+(?:\s+[A-Za-z]+)?/),

    timeline_text: ($) => repeat1(choice($.html_tag, $.timeline_text_fragment)),

    timeline_text_fragment: (_) => token(prec(PREC.remainder, /[^<\n\r;]+|</)),

    tree_statement: ($) => $.tree_item_statement,

    tree_item_statement: ($) =>
      prec(-1, seq(
        optional(field('indent', $.indentation)),
        field('name', $.quoted_string),
        repeat(choice($.class_annotation, $.tree_icon_annotation, $.tree_description_annotation)),
        optional(seq(choice(':', ','), field('value', $.number), optional($.class_annotation))),
        $._terminator,
      )),

    tree_icon_annotation: (_) => token(seq('icon(', /[\w-]*/, ')')),
    tree_description_annotation: (_) => token(seq('##', /[^\n\r]*/)),
    bare_tree_name: (_) => token(prec(PREC.remainder, /[^ \t\n\r"'#:,{][^\n\r:,{]*/)),

    wardley_statement: ($) =>
      choice(
        $.wardley_keyword_statement,
        $.wardley_edge_statement,
      ),

    wardley_keyword_statement: ($) =>
      seq(
        field(
          'keyword',
          choice(
            'size',
            'evolution',
            'anchor',
            'component',
            'label',
            'evolve',
            'pipeline',
            'note',
            'annotations',
            'annotation',
            'accelerator',
            'deaccelerator',
          ),
        ),
        optional($._line_remainder),
        $._terminator,
      ),

    wardley_edge_statement: ($) =>
      prec(PREC.flow_statement, seq(
        field('source', $.identifier),
        field('operator', $.wardley_arrow),
        field('target', $.identifier),
        optional($._line_remainder),
        $._terminator,
      )),

    wardley_arrow: (_) => choice('->', '-->'),

    generic_statement: ($) => seq(optional($.indentation), repeat1(choice($.identifier, $.number, $.quoted_string, $.generic_token)), $._terminator),

    identifier_list: ($) => seq($.identifier, repeat(seq(',', $.identifier))),

    number_list: ($) => seq($.number, repeat(seq(',', $.number))),

    argument_list: ($) => seq('(', optional(token(/[^)\n\r]*/)), ')'),

    brace_text: ($) => seq('{', optional(token(/[^}\n\r]*/)), '}'),

    quoted_string: (_) => token(choice(seq('"', /([^"\\]|\\.)*/, '"'), seq("'", /([^'\\]|\\.)*/, "'"))),

    label_text: ($) => repeat1(choice($.html_tag, $.label_text_fragment)),

    html_tag: (_) => token(prec(1, /<\/?[A-Za-z][A-Za-z0-9-]*(?:[ \t\f]+[^<>\n\r;]*)?[ \t\f]*\/?>/)),

    label_text_fragment: (_) => token(prec(PREC.remainder, /[^<\]\)\}\|\n\r;]+|</)),

    identifier: (_) => token(/[A-Za-z_][A-Za-z0-9_]*/),

    number: (_) => token(/-?(0|[1-9][0-9]*)(\.[0-9]+)?/),

    boolean: (_) => choice('true', 'false'),

    indentation: (_) => token(prec(1, /[ \t]+/)),

    _line_remainder: (_) => token(prec(PREC.remainder, /[^\n\r;]+/)),

    generic_token: (_) => token(prec(PREC.generic, /[^A-Za-z_0-9"'+ \t\n\r;][^ \t\n\r;]*/)),

    _terminator: (_) => choice(/\r?\n/, ';'),
  },
});
