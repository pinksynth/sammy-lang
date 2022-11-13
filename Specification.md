### Literals

| Literal   | Value                                 |
| --------- | ------------------------------------- |
| boolean   | `true`, `false`                       |
| null      | `null`                                |
| undefined | `undefined`                           |
| number    | `0`, `1.5`, `2_000`                   |
| string\*  | `"String"`, `"Interpolated {string}"` |

\*Multiline string:

```
"Multiline
string"
```

### Comments

```
# Single line comment
```

```
<<<
Multi line comment
>>>

<<<May be used on single line>>>
```

### Variables

All variables are `const` by default.

```
my_var = "string"
my_var = 1
# -> Will raise an error
```

Variables can be made `let` by using the `weak` keyword.

```
weak my_var = "string"
my_var = 1
```

### Functions

By default, functions may only be invoked with the arity declared. Multiple declarations may have separate arities. Returns are required. There is no `return` keyword.

```
function my_func(arg1 arg2) {
	arg1 + arg2
}

function my_func(arg1 arg2 arg3) {
	arg1 + arg2 - arg3
}

my_func(1 2)

# -> 3

my_func(3 4 5)

# -> 2

my_func(6)

# -> Will throw an error
```

### Literal pattern matching

```
function do_math('add' arg1 arg2) {
	arg1 + arg2
}

function do_math('multiply' arg1 arg2) {
	arg1 * arg2
}

do_math('add' 3 4)
# -> 7

do_math('multiply' 3 4)
# -> 12
```

#### Anonymous functions

```
function(arg1 arg2) {
	arg1 + arg2
}
```

#### Concise syntax

```
@{$1 * 2}

# same as

function(arg) {
	arg * 2
}
```

This syntax is useful for predicate functions and callbacks, e.g.:

```
pets.map(@{$1.name})
```

#### Calling functions

```
some_func()
```

### If statements

```
# Single line

if a == b, do_thing()

# Block

if a == b {
  do_thing()
}

# Multiple conditions
if
	a == b
	c()
	d != f
	{
	do_thing()
}
```

### Objects

```
%[key: val]

my_obj.some_property
```

### Arrays

```
[1 2 3]
```

Items are separated with whitespace, following order of operations

```
[1 + 2 3 * 4]

# same as

[3 12]
```
