import { source } from "../chimpanzee-utils";
import { module } from "./";
import { capture, any, Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { deleteF } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: source([module])(state, analysisState),
      right: {
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
            type: "UnaryExpression",
            operator: "!",
            argument: {
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
              operator: "==="
              any([
                mapResult(
                  right: {
                    type: "StringLiteral",
                    value: capture("dirName")
                    },
                  s => s.value
                ),
                right: {
                  type: "Identifier",
                  value: capture("dirName")
                }
              ])
            }
          }
        ]
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? R.equals(result.value.left, result.value.object)
            ? delete(
              { ...result.value.object,
              [result.value.key1]: result.value.val1 },
              result.value.left
            )
            : new Skip(`The result of the filter() must be assigned to the same fs module.`)
          : result
    }
  );
}
