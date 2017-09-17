module.exports = {
  type: "createFile",
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
  module: "home/office/docs",
  identifier: "myFs",
  collection: "docs"
};
