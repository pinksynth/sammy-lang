# sammy-lang

This is a project for educational purposes. It is not currently intended for Production use. Unless you really want to, I suppose.

## Compiling to Javascript sandbox compiler

You can use `src/sandbox.js` to compile SammyScript to JavaScript. For examples of syntax, see `Specification.md` and the test cases. To run the sandbox, simply run `node src/sandbox.js`. There is not currently a CLI nor package-based implementation for the JS compiler.

## Why compile to JavaScript?

It's the language I am most efficient with. My hope is to build an LLVM-based implementation using C++ in the future. Until then, the language concepts are going to be somewhat tightly coupled to JavaScript.

## Syntax highlighting

If you use VS Code, you can use the [VS Code sammy-lang Extension](https://marketplace.visualstudio.com/items?itemName=sammytaylor.sammy-lang-vs-code-extension) for syntax highlighting.

## Language features

### Primitives

The basic primitives in SammyScript are booleans, numbers, strings, and `null`.

| Literal  | Value                                 |
| -------- | ------------------------------------- |
| boolean  | `true`, `false`                       |
| null     | `null`                                |
| number   | `0`, `1.5`, `2_000`                   |
| string\* | `"String"`, `"Interpolated {string}"` |

\*Multiline string:

```sammy
"Multiline
string"
```

### Comments

```sammy
# Single line comment
```

```sammy
<<<
  Multi line comment
>>>

<<<May be used on single line>>>
```

### Variables

By default, variables may not be redefined.

```sammy
my_var = "string"
my_var = 1
# -> Will raise an error
```

Variables can be redefined by declaring them using the `weak` keyword.

```sammy
weak my_var = "string"
my_var = 1
```

### Functions

Functions work similar to other languages. Arguments are space-separated and returns are implied by the last expression in the function body—there is no `return` keyword.

```sammy
function greet() {
	name
}

greet() #=> Hello!
```

By default, functions may only be invoked with the arity (number of arguments) defined.

```sammy
function greet() { "Hello." }
function greet(name) { "{greet()} My name's {name}." }
function greet(name age) { "{greet(name)} I'm {age}." }

greet()          #=> Hello.
greet("James")   #=> Hello. My name's James.
greet("Jim" 30)  #=> Hello. My name's Jim. I'm 30.
```

#### Lambdas

Lambdas support two syntaxes: One with defined arguments, and one with positional parameters, such as `$1`, which correspond to the number of arguments provided to the lambda when called.

Defined arguments version:

```sammy
double   = @ a   { a * 2 }
multiply = @ a b { a * b }
```

Positional arguments version:

```sammy
double   = @{ $1 *  2 }
multiply = @{ $1 * $2 }
```

This syntax is useful for predicate functions and callbacks, e.g.:

```sammy
pets.map(@{$1.name})
```

#### Calling functions

```sammy
some_func()
```

### If expressions

"If"s are expressions which return a value.

```sammy
my_var = if true { "a" } else { "b" }

my_var #=> "a"
```

"If" conditions may have multiple expressions.

```sammy
if
	a == b
	c()
	d != f
	{
	do_thing()
}
```

"Else" is also supported.

```sammy
if sad {
	watch_sitcom()
} else {
	watch_drama()
}
```

When no "if" body is reached, the expression resolves to `null`.

```sammy
is_21 = false
drink = if is_21 { order_drink() }

drink #=> null
```

### Maps

Maps support basic string keys like JavaScript object literals, but will in the future support other keys.

```sammy
map = %[key: "val"]
map.key #=> "val"

other_map = %[key: @{ "other_val" }]
other_map.key() #=> "other_val"
```

### Arrays

```sammy
[1 2 3]
```

Items are separated with whitespace.

```sammy
[1 + 2 3 * 4]

# same as

[3 12]
```

### Ranges

The range operator (`..`) can be used to construct arrays on-the-fly. They can be used for integers or single-character strings.

```sammy
1..5     #=> [1 2 3 4 5]
"a".."c" #=> ["a" "b" "c"]
```

Ranges can be forwards or backwards, and may include negative integer values.

```sammy
2..-2    #=> [2 1 0 (-1) (-2)]
"z".."x" #=> ["z" "y" "x"]
```

### Math

Math follows order of operations properly.

```sammy
2 * 3 + 4 * 5 #=>  26
6 ^ 2 * 3     #=> 108
```

### Whitespace

The language does not distinguish between any whitespace characters, and there are no semicolons.

It is encouraged to use newlines to separate expressions instead of spaces. Nevertheless, the following two are identical.

```sammy
a = b()
c = d - e
f()
g
```

```sammy
a = b() c = d - e f() g
```

#### Whitespace "gotchas"

##### Negative numbers

Negative numbers should sometimes be put in parentheses. The language will treat the "minus" operator for subtraction if there is a lefthand expression to subtract from (regardless of whitespace).

For example, the following expression is read by the language in exactly the same way as `[-1 - 2 - 3]` and is therefore evaluated as `[6]`:

```sammy
[
	-1
	-2
	-3
]
```

This can be resolved using parentheses:

```sammy
[
	(-1)
	(-2)
	(-3)
]
```

##### Parentheses and function calls

When encountering a `(` token, the language will treat it as a function call if the lefthand token is an identifier (`foo`) or property access (`foo.bar`). So the following expression is evaluated as `[foo.bar(a + b)]`:

```sammy
[
	foo.bar
	(a + b)
]
```

This can be resolved (in this case) by removing the parentheses:

```sammy
[
	foo.bar
	a + b
]
```

Or in other cases where the parentheses are needed, simply add additional parentheses around the idenfitier:

```sammy
[
	(foo.bar)
	(-a + b)
]
```
