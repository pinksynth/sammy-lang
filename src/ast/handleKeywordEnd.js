const st = require("./scopeTypes")

const handleKeywordEnd = ({ currentScope, pop }) => {
  // FIXME: When receiving "end" inside of a try handler, we must pop up to the Try Body level. This is kinda just bad design.
  if (currentScope === st.TRY_HANDLER_BODY) pop()
  pop()
}

module.exports = handleKeywordEnd
