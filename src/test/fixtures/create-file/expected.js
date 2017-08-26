module.exports = {
  type: "fs_createFile",
  dir: {
    type: "StringLiteral",
    value: "documents"
  },
  filename: {
    type: "StringLiteral",
    value: "report.txt"
  },
  contents: {
    type: "StringLiteral",
    value: "hello, world"
  },
  module: "todosFsModule",
  identifier: "myFs",
  collection: "docs"
};
