const { compile } = require(".")

compile({
  input: `
# Variables and primitives
a = 1
true
"String"
1_500_000.50

# Arrays are space-separated
[1 2 3 * 4 5]

# Objects use syntax %[]
%[foo: "bar", baz: a]

# Functions are similar to JS, but with space-separated args.
# Functions also have implicit return.
function multiply(a b) {
	a * b
}

<<<
	Functions support two concise syntaxes.
	This one uses declared variables.
>>>
is_even = @ x { x % 2 == 0 }
is_even(3)

# This one uses implicit variables following the pattern $1, $2, $3...
divide = @{ $1 / $2 }

# It is very useful in map callbacks and predicate functions
[1 2 3 4 5 6 7 8 9 10]
	.filter(@{ $1 % 2 == 0 })
	.map(@{ $1 * 100 })

# If statements are treated as expressions and always return a value
mood = if Math.random() > 0.5 { "good" } else { "bad" }
`,
  debug: true,
  jsGlobals: ["console", "Math"],
})
