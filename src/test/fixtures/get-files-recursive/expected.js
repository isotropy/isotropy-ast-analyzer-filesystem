module.exports = {
  type: "getFiles",
  dir: {
    type: "StringLiteral",
    value: "/some/path"
  },
  recurse: true,
  module: "todosFsModule",
  identifier: "myFs",
  collection: "docs"
};
