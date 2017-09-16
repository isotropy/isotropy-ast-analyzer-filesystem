module.exports = {
  type: "fs_createFile",
  dirNode: {
    type: "StringLiteral",
    value: "documents"
  },
  filenameNode: {
    type: "StringLiteral",
    value: "report.txt"
  },
  contentsNode: {
    type: "StringLiteral",
    value: "hello, world"
  },
  module: "todosFsModule",
  identifier: "myFs",
  collection: "docs"
};
