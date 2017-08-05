import { root } from "./";
import { capture, any, array, map as mapResult,Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { getFiles } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: root(state, analysisState),
        property: {
          type: "Identifier",
          name: "filter"
        }
      },
      arguments: [
        {
          type: "ArrowFunctionExpression",
          params: [
            {
              type: "Identifier",
              name: "todo"
            }
          ],
          body: {
            type: "LogicalExpression",
            left: {
              type: "BinaryExpression",
              left: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: "todo"
                },
                property: {
                  type: "Identifier",
                  name: "dir"
                }
              },
              operator: "===",
              right: mapResult(
                {
                  type: "StringLiteral",
                  value: capture("dir1")
                },
                s => s.value
              )
            },
            operator: "||",
            right: {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: "todo"
                  },
                  property: {
                    type: "Identifier",
                    name: "dir"
                  }
                },
                property: {
                  type: "Identifier",
                  name: "startsWith"
                }
              },
              arguments: [
                any([
                  {
                    type: "Identifier",
                    value: capture("dir2")
                  },
                  mapResult(
                    {
                      type: "StringLiteral",
                      value: capture("dir2")
                    },
                    s => s.value
                  )
                ])
              ]
            }
          }
        }
      ]
    },
    {
      build: () => () => result =>
        result.value.dir1 === result.value.dir2
          ? getFiles(
              {
                [result.value.name]: result.value.value,
                dir: dir1,
                recurse: true
              },
              result.value.object
            )
          : new Skip(
              `The directory names should be the same to perform a
          recursive traversal to list all files.`
            )
    }
  );
}
