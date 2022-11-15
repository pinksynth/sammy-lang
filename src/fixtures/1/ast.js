const ast = {
  type: "ROOT",
  children: [
    {
      children: [{ type: "LITERAL_NUMBER", value: "1" }],
      type: "ASSIGNMENT",
      variable: "a",
    },
    { type: "LITERAL_BOOLEAN", value: "true" },
    { type: "LITERAL_STRING", value: '"String"' },
    { type: "LITERAL_NUMBER", value: "1500000.50" },
    {
      type: "LITERAL_ARRAY",
      children: [
        { type: "LITERAL_NUMBER", value: "1" },
        { type: "LITERAL_NUMBER", value: "2" },
        {
          left: { type: "LITERAL_NUMBER", value: "3" },
          operator: "*",
          type: "BINARY_EXPR",
          right: { type: "LITERAL_NUMBER", value: "4" },
        },
        { type: "LITERAL_NUMBER", value: "5" },
      ],
    },
    {
      keys: [
        { type: "IDENTIFIER", value: "foo" },
        { type: "IDENTIFIER", value: "baz" },
      ],
      values: [
        { type: "LITERAL_STRING", value: '"bar"' },
        { type: "IDENTIFIER", value: "a" },
      ],
      type: "LITERAL_OBJECT",
    },
    {
      args: [
        { type: "IDENTIFIER", value: "a" },
        { type: "IDENTIFIER", value: "b" },
      ],
      children: [
        {
          left: { type: "IDENTIFIER", value: "a" },
          operator: "*",
          type: "BINARY_EXPR",
          right: { type: "IDENTIFIER", value: "b" },
        },
      ],
      name: "multiply",
      type: "FUNCTION_DECLARATION",
    },
    {
      children: [
        {
          args: [{ type: "IDENTIFIER", value: "x" }],
          children: [
            {
              left: {
                left: { type: "IDENTIFIER", value: "x" },
                operator: "%",
                type: "BINARY_EXPR",
                right: { type: "LITERAL_NUMBER", value: "2" },
              },
              operator: "==",
              type: "BINARY_EXPR",
              right: { type: "LITERAL_NUMBER", value: "0" },
            },
          ],
          type: "LAMBDA",
        },
      ],
      type: "ASSIGNMENT",
      variable: "is_even",
    },
    {
      children: [{ type: "LITERAL_NUMBER", value: "3" }],
      function: { type: "IDENTIFIER", value: "is_even" },
      type: "FUNCTION_CALL",
    },
    {
      children: [
        {
          args: [],
          children: [
            {
              left: { type: "CONCISE_LAMBDA_ARGUMENT", value: "$1" },
              operator: "/",
              type: "BINARY_EXPR",
              right: { type: "CONCISE_LAMBDA_ARGUMENT", value: "$2" },
            },
          ],
          type: "LAMBDA",
        },
      ],
      type: "ASSIGNMENT",
      variable: "divide",
    },
    {
      left: {
        left: {
          type: "LITERAL_ARRAY",
          children: [
            { type: "LITERAL_NUMBER", value: "1" },
            { type: "LITERAL_NUMBER", value: "2" },
            { type: "LITERAL_NUMBER", value: "3" },
            { type: "LITERAL_NUMBER", value: "4" },
            { type: "LITERAL_NUMBER", value: "5" },
            { type: "LITERAL_NUMBER", value: "6" },
            { type: "LITERAL_NUMBER", value: "7" },
            { type: "LITERAL_NUMBER", value: "8" },
            { type: "LITERAL_NUMBER", value: "9" },
            { type: "LITERAL_NUMBER", value: "10" },
          ],
        },
        operator: ".",
        type: "BINARY_EXPR",
        right: {
          children: [
            {
              args: [],
              children: [
                {
                  left: {
                    left: {
                      operand: {
                        type: "CONCISE_LAMBDA_ARGUMENT",
                        value: "$1",
                      },
                      operator: "-",
                      type: "UNARY_EXPRESSION",
                    },
                    operator: "%",
                    type: "BINARY_EXPR",
                    right: { type: "LITERAL_NUMBER", value: "2" },
                  },
                  operator: "!=",
                  type: "BINARY_EXPR",
                  right: { type: "LITERAL_NUMBER", value: "0" },
                },
              ],
              type: "LAMBDA",
            },
          ],
          function: { type: "IDENTIFIER", value: "filter" },
          type: "FUNCTION_CALL",
        },
      },
      operator: ".",
      type: "BINARY_EXPR",
      right: {
        children: [
          {
            args: [],
            children: [
              {
                left: { type: "CONCISE_LAMBDA_ARGUMENT", value: "$1" },
                operator: "*",
                type: "BINARY_EXPR",
                right: { type: "LITERAL_NUMBER", value: "100" },
              },
            ],
            type: "LAMBDA",
          },
        ],
        function: { type: "IDENTIFIER", value: "map" },
        type: "FUNCTION_CALL",
      },
    },
    {
      children: [
        {
          condition: [
            {
              left: {
                left: { type: "IDENTIFIER", value: "Math" },
                operator: ".",
                type: "BINARY_EXPR",
                right: {
                  children: [],
                  function: { type: "IDENTIFIER", value: "random" },
                  type: "FUNCTION_CALL",
                },
              },
              operator: ">",
              type: "BINARY_EXPR",
              right: { type: "LITERAL_NUMBER", value: "0.5" },
            },
          ],
          children: [{ type: "LITERAL_STRING", value: '"good"' }],
          else: [{ type: "LITERAL_STRING", value: '"bad"' }],
          type: "IF_EXPR",
        },
      ],
      type: "ASSIGNMENT",
      variable: "mood",
    },
  ],
}

module.exports = ast
