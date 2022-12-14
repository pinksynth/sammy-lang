const input = `
# Variables and primitives
a = 1
true
"String"
1_500_000.50

# Variables are treated as "const" by default. They cannot be rebound. But "weak" variables can be rebound.
weak name = "Sammy"
name = "Jimbo"
name = name.toUpperCase()

# Arrays are space-separated
[1 2 3 * 4 5]

# The range operator (..) can be used to construct arrays from integers or characters. They may iterate forwards or backwards.
my_range = 1..10
reverse_alphabet = "z".."a"

# Objects use syntax %[]
%[foo: "bar", baz: a]

# Functions are similar to JS, but with space-separated args.
# Functions also have implicit return.
function multiply(b c) {
  b * c
}

# Expressions may be piped into function calls
square = @{ $1 * $1 }
subtract = @{ $1 - $2 }

2
-> multiply(3)
-> square()
-> subtract(5)

<<<
  Functions support two concise syntaxes.
  This one uses declared variables.
>>>
is_even = @ x { x % 2 == 0 }
is_even(3)
foo.bar() * baz.quux(foo my_range)

# This one uses implicit variables following the pattern $1, $2, $3...
divide = @{ $1 / $2 }

# It is very useful in map callbacks and predicate functions
[1 2 3 4 5 6 7 8 9 10]
  .filter(@{ -$1 % 2 != 0 })
  .map(@{ $1 * 100 })

# "Ifs" are expressions rather than statements. They return a value.
weak mood = if Math.random() > 0.5 { "good" } else { "bad" }

# If expressions allows multiple conditions to be provided. Conditions are separated by white space and the body is only executed if all conditions are true.
mood = if
  Math.random() > 0.9
  Math.random() < 0.1
  { "excellent" } else { mood }

# "Try" is supported as an expression
some_tried_var = try foo.bar * baz.quux() end

# "Try" expressions may use the "handle" keyword to handle specific kinds of errors
some_handled_var = try
  foo.bar * baz.quux()
handle error:
  console.log(error)
  foo()
  # NOTE: While this constructs a valid AST, we don't have pattern matching in the JS compiler yet!
  # handle %[my_key: "foo"]:
  #   baz()
end

# Structs may be used to enforce the shape of certain pieces of data
struct MyStruct {
  foo
  bar
  baz = "default key"
}

%MyStruct[foo: "nice", bar: 420]

# Enumerations are supported with the "enum" keyword. Case values are unique, and in JS they are stored as strings.
enum Directions {
  north
  east
  south
  west
}

Directions.north
Directions.east

# Enums also allow explicit assigning of case values.
enum Suites {
  heart   = 1
  diamond = 2
  spade   = 3
  club    = 4
}

Suites.diamond # -> 2
`
module.exports = input
