/*
Used by the lexer to keep track of curly braces seen while in string interpolation. `body` is an array of counters. The number of counters in the stack corresponds to how many contexts deep we are in string interpolation. The value of each counter corresponds to how many unclosed lefthand curly braces have been encountered in the current context.

The following demonstrates how this stack is used by the lexer (also see notes in `handleStrings.js`):

"a { b(@{ "c { d } e" }) }"
^
At this token, the stack looks like: []
Because we have not entered into any interpolation contexts.

"a { b(@{ "c { d } e" }) }"
     ^
     At this token, the stack looks like: [0]
     Because we entered into an interpolation context but haven't seen any curly braces.

"a { b(@{ "c { d } e" }) }"
          ^
          At this token, the stack looks like: [1]
          Because we entered into an interpolation context and saw a curly brace for the lambda. We will need a corresponding righthand brace before we 

"a { b(@{ "c { d } e" }) }"
               ^
               At this token, the stack looks like: [1, 0]
               Because we entered into an additional interpolation context but haven't seen any curly braces in the new context.

"a { b(@{ "c { d } e" }) }"
                 ^
                 At this token, the stack looks like: [1]
                 Because we popped exited the innermost interpolation context. We'll still need to see an additional righthand curly before we're ready to pop the new context.

"a { b(@{ "c { d } e" }) }"
                      ^
                      At this token, the stack looks like: [0]
                      Because we found the extra righthand curly brace we needed before we could pop the current interpolation context.

"a { b(@{ "c { d } e" }) }"
                         ^
                         At this token, the stack looks like: []
                         Because we found the righthand curly brace we needed to exit the outermost interpolation context. Now we are not in an interpolation context.
*/

class InterpolationContextStack {
  constructor() {
    this.body = []
  }

  push = (item) => this.body.push(item)
  pop = () => this.body.pop()
  peek = () => this.body[this.body.length - 1]
  size = () => this.body.length

  updateHead(newValue) {
    this.body[this.body.length - 1] = newValue
  }

  incrementContext = () => this.updateHead(this.peek() + 1)

  decrementContext() {
    if (this.peek() === 0) {
      throw new Error(
        "Error in lexer. Could not decrement interpolation context."
      )
    }

    return this.updateHead(this.peek() - 1)
  }

  pushContext = () => this.push(0)

  popContext() {
    if (this.peek() !== 0) {
      throw new Error("Error in lexer. Could not pop interpolation context.")
    }

    return this.pop()
  }
}

module.exports = InterpolationContextStack
