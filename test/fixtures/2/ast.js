const ast = {
  type: "ROOT",
  children: [
    {
      children: [
        {
          args: [],
          children: [
            {
              left: {
                type: "CONCISE_LAMBDA_ARGUMENT",
                value: "$1",
                lineNumberStart: 1,
                columnNumberStart: 14,
              },
              operator: "*",
              type: "BINARY_EXPR",
              lineNumberStart: 1,
              columnNumberStart: 17,
              right: {
                type: "LITERAL_NUMBER",
                value: "0.08",
                lineNumberStart: 1,
                columnNumberStart: 19,
              },
            },
          ],
          type: "LAMBDA",
          lineNumberStart: 1,
          columnNumberStart: 11,
        },
      ],
      type: "ASSIGNMENT",
      variable: "get_tax",
      weak: false,
      lineNumberStart: 1,
      columnNumberStart: 1,
    },
    {
      args: [
        {
          type: "IDENTIFIER",
          value: "subtotal",
          lineNumberStart: 3,
          columnNumberStart: 24,
        },
        {
          type: "IDENTIFIER",
          value: "customer_name",
          lineNumberStart: 3,
          columnNumberStart: 33,
        },
      ],
      children: [
        {
          type: "LITERAL_STRING",
          subStrings: [
            "\n\t\tReceipt\n\t\tSubtotal: ",
            "\n\t\tTax:      ",
            "\n\t\t--------------------\n\t\tTotal:    ",
            "\n\n\t\t",
            "\n\t",
          ],
          interpolations: [
            {
              type: "STRING_INTERPOLATION",
              children: [
                {
                  type: "IDENTIFIER",
                  value: "subtotal",
                  lineNumberStart: 6,
                  columnNumberStart: 15,
                },
              ],
            },
            {
              type: "STRING_INTERPOLATION",
              children: [
                {
                  lineNumberStart: 7,
                  columnNumberStart: 15,
                  type: "FUNCTION_CALL",
                  function: {
                    type: "IDENTIFIER",
                    value: "get_tax",
                    lineNumberStart: 7,
                    columnNumberStart: 15,
                  },
                  children: [
                    {
                      type: "IDENTIFIER",
                      value: "subtotal",
                      lineNumberStart: 7,
                      columnNumberStart: 23,
                    },
                  ],
                },
              ],
            },
            {
              type: "STRING_INTERPOLATION",
              children: [
                {
                  left: {
                    lineNumberStart: 9,
                    columnNumberStart: 15,
                    type: "FUNCTION_CALL",
                    function: {
                      type: "IDENTIFIER",
                      value: "get_tax",
                      lineNumberStart: 9,
                      columnNumberStart: 15,
                    },
                    children: [
                      {
                        type: "IDENTIFIER",
                        value: "subtotal",
                        lineNumberStart: 9,
                        columnNumberStart: 23,
                      },
                    ],
                  },
                  operator: "+",
                  type: "BINARY_EXPR",
                  lineNumberStart: 9,
                  columnNumberStart: 33,
                  right: {
                    type: "IDENTIFIER",
                    value: "subtotal",
                    lineNumberStart: 9,
                    columnNumberStart: 35,
                  },
                },
              ],
            },
            {
              type: "STRING_INTERPOLATION",
              children: [
                {
                  condition: [
                    {
                      type: "IDENTIFIER",
                      value: "customer_name",
                      lineNumberStart: 12,
                      columnNumberStart: 7,
                    },
                  ],
                  children: [
                    {
                      type: "LITERAL_STRING",
                      subStrings: ["Have a great day, ", ""],
                      interpolations: [
                        {
                          type: "STRING_INTERPOLATION",
                          children: [
                            {
                              type: "IDENTIFIER",
                              value: "customer_name",
                              lineNumberStart: 13,
                              columnNumberStart: 26,
                            },
                          ],
                        },
                      ],
                      lineNumberStart: 13,
                      columnNumberStart: 5,
                    },
                  ],
                  else: [
                    {
                      type: "LITERAL_STRING",
                      subStrings: ["Have a great day!"],
                      interpolations: [],
                      lineNumberStart: 15,
                      columnNumberStart: 5,
                    },
                  ],
                  type: "IF_EXPR",
                  lineNumberStart: 12,
                  columnNumberStart: 4,
                },
              ],
            },
          ],
          lineNumberStart: 4,
          columnNumberStart: 2,
        },
      ],
      name: "print_receipt",
      type: "FUNCTION_DEFINITION",
      lineNumberStart: 3,
      columnNumberStart: 1,
    },
    {
      args: [
        {
          type: "IDENTIFIER",
          value: "subtotal",
          lineNumberStart: 21,
          columnNumberStart: 24,
        },
      ],
      children: [
        {
          lineNumberStart: 21,
          columnNumberStart: 36,
          type: "FUNCTION_CALL",
          function: {
            type: "IDENTIFIER",
            value: "print_receipt",
            lineNumberStart: 21,
            columnNumberStart: 36,
          },
          children: [
            {
              type: "IDENTIFIER",
              value: "subtotal",
              lineNumberStart: 21,
              columnNumberStart: 50,
            },
            {
              type: "LITERAL_BOOLEAN",
              value: "false",
              lineNumberStart: 21,
              columnNumberStart: 59,
            },
          ],
        },
      ],
      name: "print_receipt",
      type: "FUNCTION_DEFINITION",
      lineNumberStart: 21,
      columnNumberStart: 1,
    },
    {
      lineNumberStart: 23,
      columnNumberStart: 1,
      type: "FUNCTION_CALL",
      function: {
        type: "IDENTIFIER",
        value: "print_receipt",
        lineNumberStart: 23,
        columnNumberStart: 1,
      },
      children: [
        {
          type: "LITERAL_NUMBER",
          value: "50",
          lineNumberStart: 23,
          columnNumberStart: 15,
        },
        {
          type: "LITERAL_STRING",
          subStrings: ["Jimbo"],
          interpolations: [],
          lineNumberStart: 23,
          columnNumberStart: 18,
        },
      ],
    },
    {
      lineNumberStart: 24,
      columnNumberStart: 1,
      type: "FUNCTION_CALL",
      function: {
        type: "IDENTIFIER",
        value: "print_receipt",
        lineNumberStart: 24,
        columnNumberStart: 1,
      },
      children: [
        {
          type: "LITERAL_NUMBER",
          value: "75",
          lineNumberStart: 24,
          columnNumberStart: 15,
        },
      ],
    },
  ],
}

module.exports = ast
