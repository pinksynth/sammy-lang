const { performSnapshotAssertions } = require("../../helpers")
performSnapshotAssertions(
  "Big file with lots of language features",
  __dirname,
  { jsGlobals: ["console", "Math", "foo", "baz"] }
)
