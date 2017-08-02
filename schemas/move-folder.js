import { source } from "../chimpanzee-utils";
import { module } from "./";
import { capture, any, Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { move } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: source([module])(state, analysisState),
      right: {
        type: "ConditionalExpression",
        test: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: source([module])(state, analysisState),
            property: {
              type: "Identifier",
              name: "map"
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
              any([
                mapResult(
                  right: {
                    type: "StringLiteral",
                    value: "oldDir"
                  },
                  s => s.value
                ),
                right: {
                  type: "Identifier",
                  value: "oldDir"
                }
              ])
            },
          ]
        },
        consequent: {
          type: "ObjectExpression",
          properties: [
            SpreadProperty: {
              type: "SpreadProperty",
              argument: {
                type: "Identifier",
                name: "todo"
              }
            },
            ObjectProperty: {
              type: "ObjectProperty",
              key: {
                type: "Identifier",
                name: "dir"
              },
              any([
                mapResult(
                  right: {
                    type: "StringLiteral",
                    value: "newDir"
                  },
                  s => s.value
                ),
                right: {
                  type: "Identifier",
                  value: "newDir"
                }
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
