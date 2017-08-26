module.exports = {
  type: "fs_readFile",
  dir: {
    type: "StringLiteral",
    value: "/some/path"
  },
  filename: {
    type: "StringLiteral",
    value: "report.txt"
  },
  module: "todosFsModule",
  identifier: "myFs",
  collection: "docs"
};
