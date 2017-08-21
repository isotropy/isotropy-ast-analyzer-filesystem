module.exports = {
  type: "fs_moveFile",
  dir: {
    type: "StringLiteral",
    value: "documents"
  },
  filename: {
    type: "StringLiteral",
    value: "report.txt"
  },
  newDir: {
    type: "StringLiteral",
    value: "reports"
  },
  newFilename: {
    type: "StringLiteral",
    value: "report.txt"
  },
  module: "todosFsModule",
  identifier: "myFs",
  collection: "docs"
};
