module.exports = {
  type: "fs_deleteFile",
  dirNode: {
    type: "StringLiteral",
    value: "documents"
  },
  filenameNode: {
    type: "StringLiteral",
    value: "report.txt"
  },
  module: "todosFsModule",
  identifier: "myFs",
  collection: "docs"
};
