/* global test expect */
const { compiletoAST } = require("./index")

const input = `
function my_func(a b) {
	%[a: 1, "c": true, 55: [@{$1.flarn}]]
}
if foo == bar {
	x()
}
if
	a
	b
	c
{
	d()
}
`

const expectedAST = {
  type: "NT_ROOT",
  children: [
    {
      args: [
        { type: "NT_IDENTIFIER", value: "a" },
        { type: "NT_IDENTIFIER", value: "b" },
      ],
      children: [
        {
          keys: [
            { type: "NT_IDENTIFIER", value: "a" },
            { type: "NT_LITERAL_STRING", value: '"c"' },
            { type: "NT_LITERAL_NUMBER", value: "55" },
          ],
          values: [
            { type: "NT_LITERAL_NUMBER", value: "1" },
            { type: "NT_LITERAL_BOOLEAN", value: "true" },
            {
              type: "NT_LITERAL_ARRAY",
              children: [
                {
                  args: [],
                  children: [
                    {
                      left: {
                        type: "NT_CONCISE_LAMBDA_ARGUMENT",
                        value: "$1",
                      },
                      operator: ".",
                      type: "NT_BINARY_EXPR",
                      right: { type: "NT_IDENTIFIER", value: "flarn" },
                    },
                  ],
                  type: "NT_LAMBDA",
                },
              ],
            },
          ],
          type: "NT_LITERAL_OBJECT",
        },
      ],
      type: "NT_FUNCTION_DECLARATION",
    },
    {
      condition: [
        {
          left: { type: "NT_IDENTIFIER", value: "foo" },
          operator: "==",
          type: "NT_BINARY_EXPR",
          right: { type: "NT_IDENTIFIER", value: "bar" },
        },
      ],
      children: [
        {
          children: [],
          function: { type: "NT_IDENTIFIER", value: "x" },
          type: "NT_FUNCTION_CALL",
        },
      ],
      else: [],
      type: "NT_IF_EXPR",
    },
    {
      condition: [
        { type: "NT_IDENTIFIER", value: "a" },
        { type: "NT_IDENTIFIER", value: "b" },
        { type: "NT_IDENTIFIER", value: "c" },
      ],
      children: [
        {
          children: [],
          function: { type: "NT_IDENTIFIER", value: "d" },
          type: "NT_FUNCTION_CALL",
        },
      ],
      else: [],
      type: "NT_IF_EXPR",
    },
  ],
}

test("compile", () => {
  expect(compiletoAST({ input })).toEqual(expectedAST)
})
