module.exports = {
  operation: "update-file",
  dir: {
    type: "StringLiteral",
    value: "path/to/docs/"
  },
  filename: {
    type: "StringLiteral",
    value: "report.txt"
  },
  contents: { type: "StringLiteral", value: "Something, new..." },
  path: "/home/office/docs/",
  identifier: "myFS"
};
