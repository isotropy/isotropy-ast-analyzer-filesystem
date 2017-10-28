import myFS from "../my-fs";

async function moveFile() {
  myFS.docs = myFS.docs.map(
    file =>
      file.dir === "documents" && file.filename === "report.txt"
        ? { ...file, dir: "reports", filename: "new-report.txt" }
        : file
  );
}

const a = {
  body: {
    type: "ConditionalExpression",
    test: {
      type: "LogicalExpression",
      left: {
        type: "BinaryExpression",
        left: {
          type: "MemberExpression",
          object: { type: "Identifier", name: "file" },
          property: { type: "Identifier", name: "dir" }
        },
        operator: "===",
        right: { type: "StringLiteral", value: "documents" }
      },
      operator: "&&",
      right: {
        type: "BinaryExpression",
        left: {
          type: "MemberExpression",
          object: { type: "Identifier", name: "file" },
          property: { type: "Identifier", name: "filename" }
        },
        operator: "===",
        right: { type: "StringLiteral", value: "report.txt" }
      }
    },
    consequent: {
      type: "ObjectExpression",
      properties: [
        {
          type: "SpreadProperty",
          argument: { type: "Identifier", name: "file" }
        },
        {
          type: "ObjectProperty",
          method: false,
          key: { type: "Identifier", name: "dir" },
          value: { type: "StringLiteral", value: "reports" }
        },
        {
          type: "ObjectProperty",
          method: false,
          key: { type: "Identifier", name: "filename" },
          value: { type: "StringLiteral", value: "new-report.txt" }
        }
      ]
    },
    alternate: { type: "Identifier", name: "file" }
  }
};
