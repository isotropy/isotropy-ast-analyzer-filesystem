import { root } from "./";
import { capture, any, map as mapResult,Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { move } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: root(state, analysisState),
      right: {
        type: "ConditionalExpression",
        test: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: root(state, analysisState),
            property: {
              type: "Identifier",
              name: "map"
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
                right: any([
                  {
                    type: "Identifier",
                    value: "oldDir"
                  },
                  mapResult(
                    {
                      type: "StringLiteral",
                      value: "oldDir"
                    },
                    s => s.value
                  )
                ])
              },
            }
          ]
        },
        consequent: {
          type: "ObjectExpression",
          properties: [
            {
              type: "SpreadProperty",
              argument: {
                type: "Identifier",
                name: "todo"
              }
            },
            {
              type: "ObjectProperty",
              key: {
                type: "Identifier",
                name: "dir"
              },
              right: any([
                {
                  type: "Identifier",
                  value: "newDir"
                },
                mapResult(
                  {
                    type: "StringLiteral",
                    value: "newDir"
                  },
                  s => s.value
                )
              ])
            },
          ]
        },
        alternate: {
          type: "Identifier",
          name: "todo"
        }
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? R.equals(result.value.left, result.value.object)
            ? move({ ...result.value.object,
              oldDir: result.value.oldDir,
              newDir: result.value.newDir },
              result.value.left)
            : new Skip(`The result of the map() must be assigned to the same fs module.`)
          : result
    }
  );
}
