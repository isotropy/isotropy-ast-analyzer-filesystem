module.exports = {
  type: "fs_getFiles",
  dir: {
    type: "StringLiteral",
    value: "/some/path"
  },
  recurse: false,
  module: "todosFsModule",
  identifier: "myFs",
  collection: "docs"
};
