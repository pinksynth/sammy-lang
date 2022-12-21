const ast = {
  type: "ROOT",
  children: [
    {
      children: [
        {
          type: "LITERAL_NUMBER",
          value: "1",
          lineNumberStart: 2,
          columnNumberStart: 5,
        },
      ],
      type: "ASSIGNMENT",
      variable: "a",
      weak: false,
      lineNumberStart: 2,
      columnNumberStart: 1,
    },
    {
      type: "LITERAL_BOOLEAN",
      value: "true",
      lineNumberStart: 3,
      columnNumberStart: 1,
    },
    {
      type: "LITERAL_STRING",
      subStrings: ["String"],
      interpolations: [],
      lineNumberStart: 4,
      columnNumberStart: 1,
    },
    {
      type: "LITERAL_NUMBER",
      value: "1500000.50",
      lineNumberStart: 5,
      columnNumberStart: 1,
    },
    {
      children: [
        {
          type: "LITERAL_STRING",
          subStrings: ["Sammy"],
          interpolations: [],
          lineNumberStart: 8,
          columnNumberStart: 13,
        },
      ],
      type: "ASSIGNMENT",
      variable: "name",
      weak: true,
      lineNumberStart: 8,
      columnNumberStart: 1,
    },
    {
      children: [
        {
          type: "LITERAL_STRING",
          subStrings: ["Jimbo"],
          interpolations: [],
          lineNumberStart: 9,
          columnNumberStart: 8,
        },
      ],
      type: "ASSIGNMENT",
      variable: "name",
      weak: false,
      lineNumberStart: 9,
      columnNumberStart: 1,
    },
    {
      variable: "name",
      type: "ASSIGNMENT",
      lineNumberStart: 10,
      columnNumberStart: 1,
      children: [
        {
          lineNumberStart: 10,
          columnNumberStart: 12,
          type: "FUNCTION_CALL",
          function: {
            left: {
              type: "IDENTIFIER",
              value: "name",
              lineNumberStart: 10,
              columnNumberStart: 8,
            },
            operator: ".",
            type: "BINARY_EXPR",
            lineNumberStart: 10,
            columnNumberStart: 12,
            right: {
              type: "IDENTIFIER",
              value: "toUpperCase",
              lineNumberStart: 10,
              columnNumberStart: 13,
            },
          },
          children: [],
        },
      ],
    },
    {
      type: "LITERAL_ARRAY",
      children: [
        {
          type: "LITERAL_NUMBER",
          value: "1",
          lineNumberStart: 13,
          columnNumberStart: 2,
        },
        {
          type: "LITERAL_NUMBER",
          value: "2",
          lineNumberStart: 13,
          columnNumberStart: 4,
        },
        {
          left: {
            type: "LITERAL_NUMBER",
            value: "3",
            lineNumberStart: 13,
            columnNumberStart: 6,
          },
          operator: "*",
          type: "BINARY_EXPR",
          lineNumberStart: 13,
          columnNumberStart: 8,
          right: {
            type: "LITERAL_NUMBER",
            value: "4",
            lineNumberStart: 13,
            columnNumberStart: 10,
          },
        },
        {
          type: "LITERAL_NUMBER",
          value: "5",
          lineNumberStart: 13,
          columnNumberStart: 12,
        },
      ],
      lineNumberStart: 13,
      columnNumberStart: 1,
    },
    {
      left: {
        left: {
          type: "LITERAL_NUMBER",
          value: "2",
          lineNumberStart: 16,
          columnNumberStart: 1,
        },
        operator: "*",
        type: "BINARY_EXPR",
        lineNumberStart: 16,
        columnNumberStart: 3,
        right: {
          type: "LITERAL_NUMBER",
          value: "3",
          lineNumberStart: 16,
          columnNumberStart: 5,
        },
      },
      operator: "+",
      type: "BINARY_EXPR",
      lineNumberStart: 16,
      columnNumberStart: 7,
      right: {
        left: {
          type: "LITERAL_NUMBER",
          value: "4",
          lineNumberStart: 16,
          columnNumberStart: 9,
        },
        operator: "*",
        type: "BINARY_EXPR",
        lineNumberStart: 16,
        columnNumberStart: 11,
        right: {
          type: "LITERAL_NUMBER",
          value: "5",
          lineNumberStart: 16,
          columnNumberStart: 13,
        },
      },
    },
    {
      variable: "my_range",
      type: "ASSIGNMENT",
      lineNumberStart: 19,
      columnNumberStart: 1,
      children: [
        {
          left: {
            type: "LITERAL_NUMBER",
            value: "1",
            lineNumberStart: 19,
            columnNumberStart: 12,
          },
          operator: "..",
          type: "BINARY_EXPR",
          lineNumberStart: 19,
          columnNumberStart: 13,
          right: {
            type: "LITERAL_NUMBER",
            value: "10",
            lineNumberStart: 19,
            columnNumberStart: 15,
          },
        },
      ],
    },
    {
      variable: "reverse_alphabet",
      type: "ASSIGNMENT",
      lineNumberStart: 20,
      columnNumberStart: 1,
      children: [
        {
          left: {
            type: "LITERAL_STRING",
            subStrings: ["z"],
            interpolations: [],
            lineNumberStart: 20,
            columnNumberStart: 20,
          },
          operator: "..",
          type: "BINARY_EXPR",
          lineNumberStart: 20,
          columnNumberStart: 23,
          right: {
            type: "LITERAL_STRING",
            subStrings: ["a"],
            interpolations: [],
            lineNumberStart: 20,
            columnNumberStart: 25,
          },
        },
      ],
    },
    {
      type: "LITERAL_OBJECT",
      keys: [
        {
          type: "IDENTIFIER",
          value: "foo",
          lineNumberStart: 23,
          columnNumberStart: 3,
        },
        {
          type: "IDENTIFIER",
          value: "baz",
          lineNumberStart: 23,
          columnNumberStart: 15,
        },
      ],
      values: [
        {
          type: "LITERAL_STRING",
          subStrings: ["bar"],
          interpolations: [],
          lineNumberStart: 23,
          columnNumberStart: 8,
        },
        {
          type: "IDENTIFIER",
          value: "a",
          lineNumberStart: 23,
          columnNumberStart: 20,
        },
      ],
      lineNumberStart: 23,
      columnNumberStart: 1,
    },
    {
      args: [
        {
          type: "IDENTIFIER",
          value: "b",
          lineNumberStart: 27,
          columnNumberStart: 19,
        },
        {
          type: "IDENTIFIER",
          value: "c",
          lineNumberStart: 27,
          columnNumberStart: 21,
        },
      ],
      children: [
        {
          left: {
            type: "IDENTIFIER",
            value: "b",
            lineNumberStart: 28,
            columnNumberStart: 3,
          },
          operator: "*",
          type: "BINARY_EXPR",
          lineNumberStart: 28,
          columnNumberStart: 5,
          right: {
            type: "IDENTIFIER",
            value: "c",
            lineNumberStart: 28,
            columnNumberStart: 7,
          },
        },
      ],
      name: "multiply",
      type: "FUNCTION_DEFINITION",
      lineNumberStart: 27,
      columnNumberStart: 1,
    },
    {
      children: [
        {
          args: [],
          children: [
            {
              left: {
                type: "CONCISE_LAMBDA_ARGUMENT",
                value: "$1",
                lineNumberStart: 32,
                columnNumberStart: 13,
              },
              operator: "*",
              type: "BINARY_EXPR",
              lineNumberStart: 32,
              columnNumberStart: 16,
              right: {
                type: "CONCISE_LAMBDA_ARGUMENT",
                value: "$1",
                lineNumberStart: 32,
                columnNumberStart: 18,
              },
            },
          ],
          type: "LAMBDA",
          lineNumberStart: 32,
          columnNumberStart: 10,
        },
      ],
      type: "ASSIGNMENT",
      variable: "square",
      weak: false,
      lineNumberStart: 32,
      columnNumberStart: 1,
    },
    {
      children: [
        {
          args: [],
          children: [
            {
              left: {
                type: "CONCISE_LAMBDA_ARGUMENT",
                value: "$1",
                lineNumberStart: 33,
                columnNumberStart: 15,
              },
              operator: "-",
              type: "BINARY_EXPR",
              lineNumberStart: 33,
              columnNumberStart: 18,
              right: {
                type: "CONCISE_LAMBDA_ARGUMENT",
                value: "$2",
                lineNumberStart: 33,
                columnNumberStart: 20,
              },
            },
          ],
          type: "LAMBDA",
          lineNumberStart: 33,
          columnNumberStart: 12,
        },
      ],
      type: "ASSIGNMENT",
      variable: "subtract",
      weak: false,
      lineNumberStart: 33,
      columnNumberStart: 1,
    },
    {
      left: {
        left: {
          left: {
            type: "LITERAL_NUMBER",
            value: "2",
            lineNumberStart: 35,
            columnNumberStart: 1,
          },
          operator: "->",
          type: "BINARY_EXPR",
          lineNumberStart: 36,
          columnNumberStart: 1,
          right: {
            lineNumberStart: 36,
            columnNumberStart: 4,
            type: "FUNCTION_CALL",
            function: {
              type: "IDENTIFIER",
              value: "multiply",
              lineNumberStart: 36,
              columnNumberStart: 4,
            },
            children: [
              {
                type: "LITERAL_NUMBER",
                value: "3",
                lineNumberStart: 36,
                columnNumberStart: 13,
              },
            ],
          },
        },
        operator: "->",
        type: "BINARY_EXPR",
        lineNumberStart: 37,
        columnNumberStart: 1,
        right: {
          lineNumberStart: 37,
          columnNumberStart: 4,
          type: "FUNCTION_CALL",
          function: {
            type: "IDENTIFIER",
            value: "square",
            lineNumberStart: 37,
            columnNumberStart: 4,
          },
          children: [],
        },
      },
      operator: "->",
      type: "BINARY_EXPR",
      lineNumberStart: 38,
      columnNumberStart: 1,
      right: {
        lineNumberStart: 38,
        columnNumberStart: 4,
        type: "FUNCTION_CALL",
        function: {
          type: "IDENTIFIER",
          value: "subtract",
          lineNumberStart: 38,
          columnNumberStart: 4,
        },
        children: [
          {
            type: "LITERAL_NUMBER",
            value: "5",
            lineNumberStart: 38,
            columnNumberStart: 13,
          },
        ],
      },
    },
    {
      children: [
        {
          args: [
            {
              type: "IDENTIFIER",
              value: "x",
              lineNumberStart: 44,
              columnNumberStart: 13,
            },
          ],
          children: [
            {
              left: {
                left: {
                  type: "IDENTIFIER",
                  value: "x",
                  lineNumberStart: 44,
                  columnNumberStart: 17,
                },
                operator: "%",
                type: "BINARY_EXPR",
                lineNumberStart: 44,
                columnNumberStart: 19,
                right: {
                  type: "LITERAL_NUMBER",
                  value: "2",
                  lineNumberStart: 44,
                  columnNumberStart: 21,
                },
              },
              operator: "==",
              type: "BINARY_EXPR",
              lineNumberStart: 44,
              columnNumberStart: 23,
              right: {
                type: "LITERAL_NUMBER",
                value: "0",
                lineNumberStart: 44,
                columnNumberStart: 26,
              },
            },
          ],
          type: "LAMBDA",
          lineNumberStart: 44,
          columnNumberStart: 11,
        },
      ],
      type: "ASSIGNMENT",
      variable: "is_even",
      weak: false,
      lineNumberStart: 44,
      columnNumberStart: 1,
    },
    {
      lineNumberStart: 45,
      columnNumberStart: 1,
      type: "FUNCTION_CALL",
      function: {
        type: "IDENTIFIER",
        value: "is_even",
        lineNumberStart: 45,
        columnNumberStart: 1,
      },
      children: [
        {
          type: "LITERAL_NUMBER",
          value: "3",
          lineNumberStart: 45,
          columnNumberStart: 9,
        },
      ],
    },
    {
      left: {
        lineNumberStart: 46,
        columnNumberStart: 4,
        type: "FUNCTION_CALL",
        function: {
          left: {
            type: "IDENTIFIER",
            value: "foo",
            lineNumberStart: 46,
            columnNumberStart: 1,
          },
          operator: ".",
          type: "BINARY_EXPR",
          lineNumberStart: 46,
          columnNumberStart: 4,
          right: {
            type: "IDENTIFIER",
            value: "bar",
            lineNumberStart: 46,
            columnNumberStart: 5,
          },
        },
        children: [],
      },
      operator: "*",
      type: "BINARY_EXPR",
      lineNumberStart: 46,
      columnNumberStart: 11,
      right: {
        lineNumberStart: 46,
        columnNumberStart: 16,
        type: "FUNCTION_CALL",
        function: {
          left: {
            type: "IDENTIFIER",
            value: "baz",
            lineNumberStart: 46,
            columnNumberStart: 13,
          },
          operator: ".",
          type: "BINARY_EXPR",
          lineNumberStart: 46,
          columnNumberStart: 16,
          right: {
            type: "IDENTIFIER",
            value: "quux",
            lineNumberStart: 46,
            columnNumberStart: 17,
          },
        },
        children: [
          {
            type: "IDENTIFIER",
            value: "foo",
            lineNumberStart: 46,
            columnNumberStart: 22,
          },
          {
            type: "IDENTIFIER",
            value: "my_range",
            lineNumberStart: 46,
            columnNumberStart: 26,
          },
        ],
      },
    },
    {
      children: [
        {
          args: [],
          children: [
            {
              left: {
                type: "CONCISE_LAMBDA_ARGUMENT",
                value: "$1",
                lineNumberStart: 49,
                columnNumberStart: 13,
              },
              operator: "/",
              type: "BINARY_EXPR",
              lineNumberStart: 49,
              columnNumberStart: 16,
              right: {
                type: "CONCISE_LAMBDA_ARGUMENT",
                value: "$2",
                lineNumberStart: 49,
                columnNumberStart: 18,
              },
            },
          ],
          type: "LAMBDA",
          lineNumberStart: 49,
          columnNumberStart: 10,
        },
      ],
      type: "ASSIGNMENT",
      variable: "divide",
      weak: false,
      lineNumberStart: 49,
      columnNumberStart: 1,
    },
    {
      lineNumberStart: 54,
      columnNumberStart: 3,
      type: "FUNCTION_CALL",
      function: {
        left: {
          lineNumberStart: 53,
          columnNumberStart: 3,
          type: "FUNCTION_CALL",
          function: {
            left: {
              type: "LITERAL_ARRAY",
              children: [
                {
                  type: "LITERAL_NUMBER",
                  value: "1",
                  lineNumberStart: 52,
                  columnNumberStart: 2,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "2",
                  lineNumberStart: 52,
                  columnNumberStart: 4,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "3",
                  lineNumberStart: 52,
                  columnNumberStart: 6,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "4",
                  lineNumberStart: 52,
                  columnNumberStart: 8,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "5",
                  lineNumberStart: 52,
                  columnNumberStart: 10,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "6",
                  lineNumberStart: 52,
                  columnNumberStart: 12,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "7",
                  lineNumberStart: 52,
                  columnNumberStart: 14,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "8",
                  lineNumberStart: 52,
                  columnNumberStart: 16,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "9",
                  lineNumberStart: 52,
                  columnNumberStart: 18,
                },
                {
                  type: "LITERAL_NUMBER",
                  value: "10",
                  lineNumberStart: 52,
                  columnNumberStart: 20,
                },
              ],
              lineNumberStart: 52,
              columnNumberStart: 1,
            },
            operator: ".",
            type: "BINARY_EXPR",
            lineNumberStart: 53,
            columnNumberStart: 3,
            right: {
              type: "IDENTIFIER",
              value: "filter",
              lineNumberStart: 53,
              columnNumberStart: 4,
            },
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
                      lineNumberStart: 53,
                      columnNumberStart: 14,
                      operand: {
                        type: "CONCISE_LAMBDA_ARGUMENT",
                        value: "$1",
                        lineNumberStart: 53,
                        columnNumberStart: 15,
                      },
                    },
                    operator: "%",
                    type: "BINARY_EXPR",
                    lineNumberStart: 53,
                    columnNumberStart: 18,
                    right: {
                      type: "LITERAL_NUMBER",
                      value: "2",
                      lineNumberStart: 53,
                      columnNumberStart: 20,
                    },
                  },
                  operator: "!=",
                  type: "BINARY_EXPR",
                  lineNumberStart: 53,
                  columnNumberStart: 22,
                  right: {
                    type: "LITERAL_NUMBER",
                    value: "0",
                    lineNumberStart: 53,
                    columnNumberStart: 25,
                  },
                },
              ],
              type: "LAMBDA",
              lineNumberStart: 53,
              columnNumberStart: 11,
            },
          ],
        },
        operator: ".",
        type: "BINARY_EXPR",
        lineNumberStart: 54,
        columnNumberStart: 3,
        right: {
          type: "IDENTIFIER",
          value: "map",
          lineNumberStart: 54,
          columnNumberStart: 4,
        },
      },
      children: [
        {
          args: [],
          children: [
            {
              left: {
                type: "CONCISE_LAMBDA_ARGUMENT",
                value: "$1",
                lineNumberStart: 54,
                columnNumberStart: 11,
              },
              operator: "*",
              type: "BINARY_EXPR",
              lineNumberStart: 54,
              columnNumberStart: 14,
              right: {
                type: "LITERAL_NUMBER",
                value: "100",
                lineNumberStart: 54,
                columnNumberStart: 16,
              },
            },
          ],
          type: "LAMBDA",
          lineNumberStart: 54,
          columnNumberStart: 8,
        },
      ],
    },
    {
      children: [
        {
          condition: [
            {
              left: {
                lineNumberStart: 57,
                columnNumberStart: 20,
                type: "FUNCTION_CALL",
                function: {
                  left: {
                    type: "IDENTIFIER",
                    value: "Math",
                    lineNumberStart: 57,
                    columnNumberStart: 16,
                  },
                  operator: ".",
                  type: "BINARY_EXPR",
                  lineNumberStart: 57,
                  columnNumberStart: 20,
                  right: {
                    type: "IDENTIFIER",
                    value: "random",
                    lineNumberStart: 57,
                    columnNumberStart: 21,
                  },
                },
                children: [],
              },
              operator: ">",
              type: "BINARY_EXPR",
              lineNumberStart: 57,
              columnNumberStart: 30,
              right: {
                type: "LITERAL_NUMBER",
                value: "0.5",
                lineNumberStart: 57,
                columnNumberStart: 32,
              },
            },
          ],
          children: [
            {
              type: "LITERAL_STRING",
              subStrings: ["good"],
              interpolations: [],
              lineNumberStart: 57,
              columnNumberStart: 38,
            },
          ],
          else: [
            {
              type: "LITERAL_STRING",
              subStrings: ["bad"],
              interpolations: [],
              lineNumberStart: 57,
              columnNumberStart: 54,
            },
          ],
          type: "IF_EXPR",
          lineNumberStart: 57,
          columnNumberStart: 13,
        },
      ],
      type: "ASSIGNMENT",
      variable: "mood",
      weak: true,
      lineNumberStart: 57,
      columnNumberStart: 1,
    },
    {
      children: [
        {
          condition: [
            {
              left: {
                lineNumberStart: 61,
                columnNumberStart: 7,
                type: "FUNCTION_CALL",
                function: {
                  left: {
                    type: "IDENTIFIER",
                    value: "Math",
                    lineNumberStart: 61,
                    columnNumberStart: 3,
                  },
                  operator: ".",
                  type: "BINARY_EXPR",
                  lineNumberStart: 61,
                  columnNumberStart: 7,
                  right: {
                    type: "IDENTIFIER",
                    value: "random",
                    lineNumberStart: 61,
                    columnNumberStart: 8,
                  },
                },
                children: [],
              },
              operator: ">",
              type: "BINARY_EXPR",
              lineNumberStart: 61,
              columnNumberStart: 17,
              right: {
                type: "LITERAL_NUMBER",
                value: "0.9",
                lineNumberStart: 61,
                columnNumberStart: 19,
              },
            },
            {
              left: {
                lineNumberStart: 62,
                columnNumberStart: 7,
                type: "FUNCTION_CALL",
                function: {
                  left: {
                    type: "IDENTIFIER",
                    value: "Math",
                    lineNumberStart: 62,
                    columnNumberStart: 3,
                  },
                  operator: ".",
                  type: "BINARY_EXPR",
                  lineNumberStart: 62,
                  columnNumberStart: 7,
                  right: {
                    type: "IDENTIFIER",
                    value: "random",
                    lineNumberStart: 62,
                    columnNumberStart: 8,
                  },
                },
                children: [],
              },
              operator: "<",
              type: "BINARY_EXPR",
              lineNumberStart: 62,
              columnNumberStart: 17,
              right: {
                type: "LITERAL_NUMBER",
                value: "0.1",
                lineNumberStart: 62,
                columnNumberStart: 19,
              },
            },
          ],
          children: [
            {
              type: "LITERAL_STRING",
              subStrings: ["excellent"],
              interpolations: [],
              lineNumberStart: 63,
              columnNumberStart: 5,
            },
          ],
          else: [
            {
              type: "IDENTIFIER",
              value: "mood",
              lineNumberStart: 63,
              columnNumberStart: 26,
            },
          ],
          type: "IF_EXPR",
          lineNumberStart: 60,
          columnNumberStart: 8,
        },
      ],
      type: "ASSIGNMENT",
      variable: "mood",
      weak: false,
      lineNumberStart: 60,
      columnNumberStart: 1,
    },
    {
      children: [
        {
          children: [
            {
              left: {
                left: {
                  type: "IDENTIFIER",
                  value: "foo",
                  lineNumberStart: 66,
                  columnNumberStart: 22,
                },
                operator: ".",
                type: "BINARY_EXPR",
                lineNumberStart: 66,
                columnNumberStart: 25,
                right: {
                  type: "IDENTIFIER",
                  value: "bar",
                  lineNumberStart: 66,
                  columnNumberStart: 26,
                },
              },
              operator: "*",
              type: "BINARY_EXPR",
              lineNumberStart: 66,
              columnNumberStart: 30,
              right: {
                lineNumberStart: 66,
                columnNumberStart: 35,
                type: "FUNCTION_CALL",
                function: {
                  left: {
                    type: "IDENTIFIER",
                    value: "baz",
                    lineNumberStart: 66,
                    columnNumberStart: 32,
                  },
                  operator: ".",
                  type: "BINARY_EXPR",
                  lineNumberStart: 66,
                  columnNumberStart: 35,
                  right: {
                    type: "IDENTIFIER",
                    value: "quux",
                    lineNumberStart: 66,
                    columnNumberStart: 36,
                  },
                },
                children: [],
              },
            },
          ],
          handlers: [],
          handlerPatterns: [],
          type: "TRY_EXPR",
          lineNumberStart: 66,
          columnNumberStart: 18,
        },
      ],
      type: "ASSIGNMENT",
      variable: "some_tried_var",
      weak: false,
      lineNumberStart: 66,
      columnNumberStart: 1,
    },
    {
      children: [
        {
          children: [
            {
              left: {
                left: {
                  type: "IDENTIFIER",
                  value: "foo",
                  lineNumberStart: 70,
                  columnNumberStart: 3,
                },
                operator: ".",
                type: "BINARY_EXPR",
                lineNumberStart: 70,
                columnNumberStart: 6,
                right: {
                  type: "IDENTIFIER",
                  value: "bar",
                  lineNumberStart: 70,
                  columnNumberStart: 7,
                },
              },
              operator: "*",
              type: "BINARY_EXPR",
              lineNumberStart: 70,
              columnNumberStart: 11,
              right: {
                lineNumberStart: 70,
                columnNumberStart: 16,
                type: "FUNCTION_CALL",
                function: {
                  left: {
                    type: "IDENTIFIER",
                    value: "baz",
                    lineNumberStart: 70,
                    columnNumberStart: 13,
                  },
                  operator: ".",
                  type: "BINARY_EXPR",
                  lineNumberStart: 70,
                  columnNumberStart: 16,
                  right: {
                    type: "IDENTIFIER",
                    value: "quux",
                    lineNumberStart: 70,
                    columnNumberStart: 17,
                  },
                },
                children: [],
              },
            },
          ],
          handlers: [
            {
              type: "TRY_HANDLER",
              children: [
                {
                  lineNumberStart: 72,
                  columnNumberStart: 10,
                  type: "FUNCTION_CALL",
                  function: {
                    left: {
                      type: "IDENTIFIER",
                      value: "console",
                      lineNumberStart: 72,
                      columnNumberStart: 3,
                    },
                    operator: ".",
                    type: "BINARY_EXPR",
                    lineNumberStart: 72,
                    columnNumberStart: 10,
                    right: {
                      type: "IDENTIFIER",
                      value: "log",
                      lineNumberStart: 72,
                      columnNumberStart: 11,
                    },
                  },
                  children: [
                    {
                      type: "IDENTIFIER",
                      value: "error",
                      lineNumberStart: 72,
                      columnNumberStart: 15,
                    },
                  ],
                },
                {
                  lineNumberStart: 73,
                  columnNumberStart: 3,
                  type: "FUNCTION_CALL",
                  function: {
                    type: "IDENTIFIER",
                    value: "foo",
                    lineNumberStart: 73,
                    columnNumberStart: 3,
                  },
                  children: [],
                },
              ],
              lineNumberStart: 71,
              columnNumberStart: 13,
            },
          ],
          handlerPatterns: [
            {
              type: "IDENTIFIER",
              value: "error",
              lineNumberStart: 71,
              columnNumberStart: 8,
            },
          ],
          type: "TRY_EXPR",
          lineNumberStart: 69,
          columnNumberStart: 20,
        },
      ],
      type: "ASSIGNMENT",
      variable: "some_handled_var",
      weak: false,
      lineNumberStart: 69,
      columnNumberStart: 1,
    },
    {
      type: "STRUCT_DEFINITION",
      name: "MyStruct",
      children: [
        {
          type: "IDENTIFIER",
          value: "foo",
          lineNumberStart: 81,
          columnNumberStart: 3,
        },
        {
          type: "IDENTIFIER",
          value: "bar",
          lineNumberStart: 82,
          columnNumberStart: 3,
        },
        {
          children: [
            {
              type: "LITERAL_STRING",
              subStrings: ["default key"],
              interpolations: [],
              lineNumberStart: 83,
              columnNumberStart: 9,
            },
          ],
          type: "ASSIGNMENT",
          variable: "baz",
          weak: false,
          lineNumberStart: 83,
          columnNumberStart: 3,
        },
      ],
      lineNumberStart: 80,
      columnNumberStart: 1,
    },
    {
      type: "LITERAL_STRUCT",
      structType: "MyStruct",
      keys: [
        {
          type: "IDENTIFIER",
          value: "foo",
          lineNumberStart: 86,
          columnNumberStart: 11,
        },
        {
          type: "IDENTIFIER",
          value: "bar",
          lineNumberStart: 86,
          columnNumberStart: 24,
        },
      ],
      values: [
        {
          type: "LITERAL_STRING",
          subStrings: ["nice"],
          interpolations: [],
          lineNumberStart: 86,
          columnNumberStart: 16,
        },
        {
          type: "LITERAL_NUMBER",
          value: "420",
          lineNumberStart: 86,
          columnNumberStart: 29,
        },
      ],
      lineNumberStart: 86,
      columnNumberStart: 1,
    },
    {
      type: "ENUM_DEFINITION",
      name: "Directions",
      children: [
        {
          type: "IDENTIFIER",
          value: "north",
          lineNumberStart: 90,
          columnNumberStart: 3,
        },
        {
          type: "IDENTIFIER",
          value: "east",
          lineNumberStart: 91,
          columnNumberStart: 3,
        },
        {
          type: "IDENTIFIER",
          value: "south",
          lineNumberStart: 92,
          columnNumberStart: 3,
        },
        {
          type: "IDENTIFIER",
          value: "west",
          lineNumberStart: 93,
          columnNumberStart: 3,
        },
      ],
      lineNumberStart: 89,
      columnNumberStart: 1,
    },
    {
      left: {
        type: "IDENTIFIER",
        value: "Directions",
        lineNumberStart: 96,
        columnNumberStart: 1,
      },
      operator: ".",
      type: "BINARY_EXPR",
      lineNumberStart: 96,
      columnNumberStart: 11,
      right: {
        type: "IDENTIFIER",
        value: "north",
        lineNumberStart: 96,
        columnNumberStart: 12,
      },
    },
    {
      left: {
        type: "IDENTIFIER",
        value: "Directions",
        lineNumberStart: 97,
        columnNumberStart: 1,
      },
      operator: ".",
      type: "BINARY_EXPR",
      lineNumberStart: 97,
      columnNumberStart: 11,
      right: {
        type: "IDENTIFIER",
        value: "east",
        lineNumberStart: 97,
        columnNumberStart: 12,
      },
    },
    {
      type: "ENUM_DEFINITION",
      name: "Suites",
      children: [
        {
          children: [
            {
              type: "LITERAL_NUMBER",
              value: "1",
              lineNumberStart: 101,
              columnNumberStart: 13,
            },
          ],
          type: "ASSIGNMENT",
          variable: "heart",
          weak: false,
          lineNumberStart: 101,
          columnNumberStart: 3,
        },
        {
          children: [
            {
              type: "LITERAL_NUMBER",
              value: "2",
              lineNumberStart: 102,
              columnNumberStart: 13,
            },
          ],
          type: "ASSIGNMENT",
          variable: "diamond",
          weak: false,
          lineNumberStart: 102,
          columnNumberStart: 3,
        },
        {
          children: [
            {
              type: "LITERAL_NUMBER",
              value: "3",
              lineNumberStart: 103,
              columnNumberStart: 13,
            },
          ],
          type: "ASSIGNMENT",
          variable: "spade",
          weak: false,
          lineNumberStart: 103,
          columnNumberStart: 3,
        },
        {
          children: [
            {
              type: "LITERAL_NUMBER",
              value: "4",
              lineNumberStart: 104,
              columnNumberStart: 13,
            },
          ],
          type: "ASSIGNMENT",
          variable: "club",
          weak: false,
          lineNumberStart: 104,
          columnNumberStart: 3,
        },
      ],
      lineNumberStart: 100,
      columnNumberStart: 1,
    },
    {
      left: {
        type: "IDENTIFIER",
        value: "Suites",
        lineNumberStart: 107,
        columnNumberStart: 1,
      },
      operator: ".",
      type: "BINARY_EXPR",
      lineNumberStart: 107,
      columnNumberStart: 7,
      right: {
        type: "IDENTIFIER",
        value: "diamond",
        lineNumberStart: 107,
        columnNumberStart: 8,
      },
    },
    {
      children: [
        {
          type: "LITERAL_STRING",
          subStrings: ["Hello! My name is ", ". I am feeling ", ""],
          interpolations: [
            {
              type: "STRING_INTERPOLATION",
              children: [
                {
                  type: "IDENTIFIER",
                  value: "name",
                  lineNumberStart: 110,
                  columnNumberStart: 34,
                },
              ],
            },
            {
              type: "STRING_INTERPOLATION",
              children: [
                {
                  condition: [
                    {
                      left: {
                        type: "IDENTIFIER",
                        value: "mood",
                        lineNumberStart: 111,
                        columnNumberStart: 6,
                      },
                      operator: "==",
                      type: "BINARY_EXPR",
                      lineNumberStart: 111,
                      columnNumberStart: 11,
                      right: {
                        type: "LITERAL_STRING",
                        subStrings: ["good"],
                        interpolations: [],
                        lineNumberStart: 111,
                        columnNumberStart: 14,
                      },
                    },
                  ],
                  children: [
                    {
                      type: "LITERAL_STRING",
                      subStrings: ["just fine!"],
                      interpolations: [],
                      lineNumberStart: 112,
                      columnNumberStart: 5,
                    },
                  ],
                  else: [
                    {
                      type: "LITERAL_STRING",
                      subStrings: ["not so hot."],
                      interpolations: [],
                      lineNumberStart: 114,
                      columnNumberStart: 5,
                    },
                  ],
                  type: "IF_EXPR",
                  lineNumberStart: 111,
                  columnNumberStart: 3,
                },
              ],
            },
          ],
          lineNumberStart: 110,
          columnNumberStart: 13,
        },
      ],
      type: "ASSIGNMENT",
      variable: "my_string",
      weak: false,
      lineNumberStart: 110,
      columnNumberStart: 1,
    },
  ],
}

module.exports = ast
