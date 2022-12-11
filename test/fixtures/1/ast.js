const ast = {
  type: "ROOT",
  children: [
    {
      children: [{ type: "LITERAL_NUMBER", value: "1" }],
      type: "ASSIGNMENT",
      variable: "a",
      weak: false,
    },
    { type: "LITERAL_BOOLEAN", value: "true" },
    { type: "LITERAL_STRING", value: '"String"' },
    { type: "LITERAL_NUMBER", value: "1500000.50" },
    {
      children: [{ type: "LITERAL_STRING", value: '"Sammy"' }],
      type: "ASSIGNMENT",
      variable: "name",
      weak: true,
    },
    {
      children: [{ type: "LITERAL_STRING", value: '"Jimbo"' }],
      type: "ASSIGNMENT",
      variable: "name",
      weak: false,
    },
    {
      variable: "name",
      type: "ASSIGNMENT",
      children: [
        {
          type: "FUNCTION_CALL",
          function: {
            left: { type: "IDENTIFIER", value: "name" },
            operator: ".",
            type: "BINARY_EXPR",
            right: { type: "IDENTIFIER", value: "toUpperCase" },
          },
          children: [],
        },
      ],
    },
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
      variable: "my_range",
      type: "ASSIGNMENT",
      children: [
        {
          left: { type: "LITERAL_NUMBER", value: "1" },
          operator: "..",
          type: "BINARY_EXPR",
          right: { type: "LITERAL_NUMBER", value: "10" },
        },
      ],
    },
    {
      variable: "reverse_alphabet",
      type: "ASSIGNMENT",
      children: [
        {
          left: { type: "LITERAL_STRING", value: '"z"' },
          operator: "..",
          type: "BINARY_EXPR",
          right: { type: "LITERAL_STRING", value: '"a"' },
        },
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
        { type: "IDENTIFIER", value: "b" },
        { type: "IDENTIFIER", value: "c" },
      ],
      children: [
        {
          left: { type: "IDENTIFIER", value: "b" },
          operator: "*",
          type: "BINARY_EXPR",
          right: { type: "IDENTIFIER", value: "c" },
        },
      ],
      name: "multiply",
      type: "FUNCTION_DECLARATION",
    },
    {
      children: [
        {
          args: [],
          children: [
            {
              left: { type: "CONCISE_LAMBDA_ARGUMENT", value: "$1" },
              operator: "*",
              type: "BINARY_EXPR",
              right: { type: "CONCISE_LAMBDA_ARGUMENT", value: "$1" },
            },
          ],
          type: "LAMBDA",
        },
      ],
      type: "ASSIGNMENT",
      variable: "square",
      weak: false,
    },
    {
      children: [
        {
          args: [],
          children: [
            {
              left: { type: "CONCISE_LAMBDA_ARGUMENT", value: "$1" },
              operator: "-",
              type: "BINARY_EXPR",
              right: { type: "CONCISE_LAMBDA_ARGUMENT", value: "$2" },
            },
          ],
          type: "LAMBDA",
        },
      ],
      type: "ASSIGNMENT",
      variable: "subtract",
      weak: false,
    },
    {
      left: {
        left: {
          left: { type: "LITERAL_NUMBER", value: "2" },
          operator: "->",
          type: "BINARY_EXPR",
          right: {
            type: "FUNCTION_CALL",
            function: { type: "IDENTIFIER", value: "multiply" },
            children: [{ type: "LITERAL_NUMBER", value: "3" }],
          },
        },
        operator: "->",
        type: "BINARY_EXPR",
        right: {
          type: "FUNCTION_CALL",
          function: { type: "IDENTIFIER", value: "square" },
          children: [],
        },
      },
      operator: "->",
      type: "BINARY_EXPR",
      right: {
        type: "FUNCTION_CALL",
        function: { type: "IDENTIFIER", value: "subtract" },
        children: [{ type: "LITERAL_NUMBER", value: "5" }],
      },
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
      weak: false,
    },
    {
      type: "FUNCTION_CALL",
      function: { type: "IDENTIFIER", value: "is_even" },
      children: [{ type: "LITERAL_NUMBER", value: "3" }],
    },
    {
      left: {
        type: "FUNCTION_CALL",
        function: {
          left: { type: "IDENTIFIER", value: "foo" },
          operator: ".",
          type: "BINARY_EXPR",
          right: { type: "IDENTIFIER", value: "bar" },
        },
        children: [],
      },
      operator: "*",
      type: "BINARY_EXPR",
      right: {
        type: "FUNCTION_CALL",
        function: {
          left: { type: "IDENTIFIER", value: "baz" },
          operator: ".",
          type: "BINARY_EXPR",
          right: { type: "IDENTIFIER", value: "quux" },
        },
        children: [
          { type: "IDENTIFIER", value: "foo" },
          { type: "IDENTIFIER", value: "my_range" },
        ],
      },
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
      weak: false,
    },
    {
      type: "FUNCTION_CALL",
      function: {
        left: {
          type: "FUNCTION_CALL",
          function: {
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
            right: { type: "IDENTIFIER", value: "filter" },
          },
          children: [
            {
              args: [],
              children: [
                {
                  left: {
                    left: {
                      operator: "-",
                      type: "UNARY_EXPRESSION",
                      operand: { type: "CONCISE_LAMBDA_ARGUMENT", value: "$1" },
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
        },
        operator: ".",
        type: "BINARY_EXPR",
        right: { type: "IDENTIFIER", value: "map" },
      },
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
    },
    {
      children: [
        {
          condition: [
            {
              left: {
                type: "FUNCTION_CALL",
                function: {
                  left: { type: "IDENTIFIER", value: "Math" },
                  operator: ".",
                  type: "BINARY_EXPR",
                  right: { type: "IDENTIFIER", value: "random" },
                },
                children: [],
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
      weak: true,
    },
    {
      children: [
        {
          condition: [
            {
              left: {
                type: "FUNCTION_CALL",
                function: {
                  left: { type: "IDENTIFIER", value: "Math" },
                  operator: ".",
                  type: "BINARY_EXPR",
                  right: { type: "IDENTIFIER", value: "random" },
                },
                children: [],
              },
              operator: ">",
              type: "BINARY_EXPR",
              right: { type: "LITERAL_NUMBER", value: "0.9" },
            },
            {
              left: {
                type: "FUNCTION_CALL",
                function: {
                  left: { type: "IDENTIFIER", value: "Math" },
                  operator: ".",
                  type: "BINARY_EXPR",
                  right: { type: "IDENTIFIER", value: "random" },
                },
                children: [],
              },
              operator: "<",
              type: "BINARY_EXPR",
              right: { type: "LITERAL_NUMBER", value: "0.1" },
            },
          ],
          children: [{ type: "LITERAL_STRING", value: '"excellent"' }],
          else: [{ type: "IDENTIFIER", value: "mood" }],
          type: "IF_EXPR",
        },
      ],
      type: "ASSIGNMENT",
      variable: "mood",
      weak: false,
    },
  ],
}

module.exports = ast
