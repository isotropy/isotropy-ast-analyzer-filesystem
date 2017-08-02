import { source } from "../chimpanzee-utils";
import { module } from "./";
import { capture, any, array, Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { getFiles } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([module])(state, analysisState),
        property: {
          type: "Identifier",
          name: "filter"
        }
      },
      arguments: [
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
            mapResult(
              right: {
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
            any([
              mapResult(
                arguments: array([
                  StringLiteral: {
                  type: "StringLiteral",
                  value: capture("dir2")
                  }]),
                s => s.value
              ),
              arguments: array([
                Identifier: {
                type: "Identifier",
                value: capture("dir2")
                }
              ])
            ])
            )
          }
        }
      ]
    },
    {
      build: () => () => result =>
        result.value.dir1 === result.value.dir2
        ? getFiles(
          { [result.value.name]: result.value.value,
            "dir": dir1,
            recurse: true },
          result.value.object
        )
        : new Skip(`The directory names should be the same to perform a
          recursive traversal to list all files.`)
    }
  );
}
