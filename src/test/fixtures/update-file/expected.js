module.exports = {
  type: "fs_updateFile",
  dir: {
    "type": "StringLiteral",
    "value": "documents"
  },
  filename: {
    "type": "StringLiteral",
    "value": "report.txt"
  },
  content: {
    "type": "StringLiteral",
    "value": "hello, universe"
  },
  module: "todosFsModule",
  identifier: "myFs",
  collection: "docs"
}
