module.exports = {
  operation: "create-file",
  path: "/home/office/docs/",
  identifier: "myFS",
  files: {
    type: "ObjectExpression",
    properties: [
      {
        type: "ObjectProperty",
        method: false,
        key: { type: "Identifier", name: "dir" },
        value: { type: "StringLiteral", value: "path/to/docs/" }
      },
      {
        type: "ObjectProperty",
        method: false,
        key: { type: "Identifier", name: "filename" },
        value: { type: "StringLiteral", value: "report.txt" }
      },
      {
        type: "ObjectProperty",
        method: false,
        key: { type: "Identifier", name: "contents" },
        value: { type: "StringLiteral", value: "hello, world" }
      }
    ]
  }
};
