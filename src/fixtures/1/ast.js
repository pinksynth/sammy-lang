const ast = {
  type: "NT_ROOT",
  children: [
    {
      children: [{ type: "NT_LITERAL_NUMBER", value: "1" }],
      type: "NT_ASSIGNMENT",
      variable: "a",
    },
    { type: "NT_LITERAL_BOOLEAN", value: "true" },
    { type: "NT_LITERAL_STRING", value: '"String"' },
    { type: "NT_LITERAL_NUMBER", value: "1500000.50" },
    {
      type: "NT_LITERAL_ARRAY",
      children: [
        { type: "NT_LITERAL_NUMBER", value: "1" },
        { type: "NT_LITERAL_NUMBER", value: "2" },
        {
          left: { type: "NT_LITERAL_NUMBER", value: "3" },
          operator: "*",
          type: "NT_BINARY_EXPR",
          right: { type: "NT_LITERAL_NUMBER", value: "4" },
        },
        { type: "NT_LITERAL_NUMBER", value: "5" },
      ],
    },
    {
      keys: [
        { type: "NT_IDENTIFIER", value: "foo" },
        { type: "NT_IDENTIFIER", value: "baz" },
      ],
      values: [
        { type: "NT_LITERAL_STRING", value: '"bar"' },
        { type: "NT_IDENTIFIER", value: "a" },
      ],
      type: "NT_LITERAL_OBJECT",
    },
    {
      args: [
        { type: "NT_IDENTIFIER", value: "a" },
        { type: "NT_IDENTIFIER", value: "b" },
      ],
      children: [
        {
          left: { type: "NT_IDENTIFIER", value: "a" },
          operator: "*",
          type: "NT_BINARY_EXPR",
          right: { type: "NT_IDENTIFIER", value: "b" },
        },
      ],
      name: "multiply",
      type: "NT_FUNCTION_DECLARATION",
    },
    {
      children: [
        {
          args: [{ type: "NT_IDENTIFIER", value: "x" }],
          children: [
            {
              left: {
                left: { type: "NT_IDENTIFIER", value: "x" },
                operator: "%",
                type: "NT_BINARY_EXPR",
                right: { type: "NT_LITERAL_NUMBER", value: "2" },
              },
              operator: "==",
              type: "NT_BINARY_EXPR",
              right: { type: "NT_LITERAL_NUMBER", value: "0" },
            },
          ],
          type: "NT_LAMBDA",
        },
      ],
      type: "NT_ASSIGNMENT",
      variable: "is_even",
    },
    {
      children: [{ type: "NT_LITERAL_NUMBER", value: "3" }],
      function: { type: "NT_IDENTIFIER", value: "is_even" },
      type: "NT_FUNCTION_CALL",
    },
    {
      children: [
        {
          args: [],
          children: [
            {
              left: { type: "NT_CONCISE_LAMBDA_ARGUMENT", value: "$1" },
              operator: "/",
              type: "NT_BINARY_EXPR",
              right: { type: "NT_CONCISE_LAMBDA_ARGUMENT", value: "$2" },
            },
          ],
          type: "NT_LAMBDA",
        },
      ],
      type: "NT_ASSIGNMENT",
      variable: "divide",
    },
    {
      left: {
        left: {
          type: "NT_LITERAL_ARRAY",
          children: [
            { type: "NT_LITERAL_NUMBER", value: "1" },
            { type: "NT_LITERAL_NUMBER", value: "2" },
            { type: "NT_LITERAL_NUMBER", value: "3" },
            { type: "NT_LITERAL_NUMBER", value: "4" },
            { type: "NT_LITERAL_NUMBER", value: "5" },
            { type: "NT_LITERAL_NUMBER", value: "6" },
            { type: "NT_LITERAL_NUMBER", value: "7" },
            { type: "NT_LITERAL_NUMBER", value: "8" },
            { type: "NT_LITERAL_NUMBER", value: "9" },
            { type: "NT_LITERAL_NUMBER", value: "10" },
          ],
        },
        operator: ".",
        type: "NT_BINARY_EXPR",
        right: {
          children: [
            {
              args: [],
              children: [
                {
                  left: {
                    left: {
                      operand: {
                        type: "NT_CONCISE_LAMBDA_ARGUMENT",
                        value: "$1",
                      },
                      operator: "-",
                      type: "NT_UNARY_EXPRESSION",
                    },
                    operator: "%",
                    type: "NT_BINARY_EXPR",
                    right: { type: "NT_LITERAL_NUMBER", value: "2" },
                  },
                  operator: "!=",
                  type: "NT_BINARY_EXPR",
                  right: { type: "NT_LITERAL_NUMBER", value: "0" },
                },
              ],
              type: "NT_LAMBDA",
            },
          ],
          function: { type: "NT_IDENTIFIER", value: "filter" },
          type: "NT_FUNCTION_CALL",
        },
      },
      operator: ".",
      type: "NT_BINARY_EXPR",
      right: {
        children: [
          {
            args: [],
            children: [
              {
                left: { type: "NT_CONCISE_LAMBDA_ARGUMENT", value: "$1" },
                operator: "*",
                type: "NT_BINARY_EXPR",
                right: { type: "NT_LITERAL_NUMBER", value: "100" },
              },
            ],
            type: "NT_LAMBDA",
          },
        ],
        function: { type: "NT_IDENTIFIER", value: "map" },
        type: "NT_FUNCTION_CALL",
      },
    },
    {
      children: [
        {
          condition: [
            {
              left: {
                left: { type: "NT_IDENTIFIER", value: "Math" },
                operator: ".",
                type: "NT_BINARY_EXPR",
                right: {
                  children: [],
                  function: { type: "NT_IDENTIFIER", value: "random" },
                  type: "NT_FUNCTION_CALL",
                },
              },
              operator: ">",
              type: "NT_BINARY_EXPR",
              right: { type: "NT_LITERAL_NUMBER", value: "0.5" },
            },
          ],
          children: [{ type: "NT_LITERAL_STRING", value: '"good"' }],
          else: [{ type: "NT_LITERAL_STRING", value: '"bad"' }],
          type: "NT_IF_EXPR",
        },
      ],
      type: "NT_ASSIGNMENT",
      variable: "mood",
    },
  ],
}

module.exports = ast
