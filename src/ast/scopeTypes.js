const st = {
  ARRAY: /*                   */ "ARRAY",
  ASSIGNMENT: /*              */ "ASSIGNMENT",
  BINARY_OPERATOR: /*         */ "BINARY_OPERATOR",
  ENUM_DEFINITION: /*         */ "ENUM_DEFINITION",
  FUNCTION_CALL_ARGS: /*      */ "FUNCTION_CALL_ARGS",
  FUNCTION_DEC_ARGS: /*       */ "FUNCTION_DEC_ARGS",
  FUNCTION_DEC_BODY: /*       */ "FUNCTION_DEC_BODY",
  GENERIC_EXPRESSION: /*      */ "GENERIC_EXPRESSION",
  IF_BODY: /*                 */ "IF_BODY",
  IF_CONDITION: /*            */ "IF_CONDITION",
  IF_ELSE: /*                 */ "IF_ELSE",
  LAMBDA_ARGS: /*             */ "LAMBDA_ARGS",
  LAMBDA_BODY: /*             */ "LAMBDA_BODY",
  MAP_KEY: /*                 */ "MAP_KEY",
  MAP_VALUE: /*               */ "MAP_VALUE",
  ROOT: /*                    */ "ROOT",
  STRING_INTERPOLATION: /*    */ "STRING_INTERPOLATION",
  STRING: /*                  */ "STRING",
  STRUCT_DEFINITION: /*       */ "STRUCT_DEFINITION",
  STRUCT_KEY: /*              */ "STRUCT_KEY",
  STRUCT_VALUE: /*            */ "STRUCT_VALUE",
  TRY_BODY: /*                */ "TRY_BODY",
  TRY_HANDLER_BODY: /*        */ "TRY_HANDLER_BODY",
  TRY_HANDLER_PATTERN: /*     */ "TRY_HANDLER_PATTERN",
  UNARY_OPERATOR: /*          */ "UNARY_OPERATOR",
}

st.operandScopeTypes = [st.ASSIGNMENT, st.UNARY_OPERATOR, st.BINARY_OPERATOR]

module.exports = st
