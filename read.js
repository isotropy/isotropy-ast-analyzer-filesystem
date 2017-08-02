import { source } from "../chimpanzee-utils";
import { module } from "./";
import { capture, any, Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { read } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([module])(state, analysisState),
        property: {
          type: "Identifier",
          name: "find"
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
                name: capture("key1")
              }
            },
            operator: "===",
            any([
              mapResult(
                right: {
                  type: "StringLiteral",
                  value: capture("val1")
                },
                s => s.value
              ),
              right: {
                type: "Identifier",
                value: capture("val1")
              }
            ])
          },
          operator: "&&",
          right: {
            type: "BinaryExpression",
            left: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: "todo"
              },
              operator: "===",
              property: {
                type: "Identifier",
                name: capture("key2")
              }
            },
            any([
              mapResult(
                right: {
                  type: "StringLiteral",
                  value: capture("val2")
                },
                s => s.value
              ),
              right: {
                type: "Identifier",
                value: capture("val2")
              }
            ])
          }
        }
      ]
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? R.equals(result.value.left, result.value.object)
            ? result.value.key1 !== result.value.key2
              && [result.value.key1, result.value.key2].every((v, i)
                  => ["dir", "filename"].includes(v.key))
              ? read({ ...result.value.object,
                [result.value.key1]: result.value.val1,
                [result.value.key2]: result.value.val2 },
                result.value.left)
              : new Skip(`The result of the find() must be assigned to the same fs module.`)
            : new Skip(`The "dir" and "filename" must be specified for read`)
          : result
    }
  );
}
