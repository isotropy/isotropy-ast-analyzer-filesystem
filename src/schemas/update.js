import { root } from "./";
import { capture, any, map as mapResult, Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { update } from "../fs-statements";

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
                  right: mapResult(
                    {
                      type: "StringLiteral",
                      value: capture("val1")
                    },
                    s => s.value
                  )
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
                  right: any([
                    {
                      type: "Identifier",
                      value: capture("val2")
                    },
                    mapResult(
                      {
                        type: "StringLiteral",
                        value: capture("val2")
                      },
                      s => s.value
                    )
                  ])
                }
              }
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
                name: "contents"
              },
              value: any([
                {
                  type: "Identifier",
                  value: capture("newContent")
                },
                mapResult(
                  {
                    type: "StringLiteral",
                    value: capture("newContent")
                  },
                  s => s.value
                )
              ])
            }
          ]
        },
        alternate: {
          type: "Identifier",
          name: "todo"
        }
      }
    },
    {
      build: obj => context => result => {
        return result instanceof Match
          ? (() => {
              const shouldContain = ["dir", "filename"];
              const mapKeys = [result.value.key1, result.value.key2];

              return R.equals(result.value.left, result.value.object)
                ? mapKeys[0] !== mapKeys[1] &&
                    updateKeys[0] !== updateKeys[1] &&
                    mapKeys.every((v, i) => shouldContain.includes(v.key))
                  ? update(
                      {
                        ...result.value.object,
                        [result.value.key1]: result.value.val1,
                        [result.value.key2]: result.value.val2,
                        content: result.value.newContent
                      },
                      result.value.left
                    )
                  : new Skip(
                      `The result of the filter() must be assigned to the same fs module.`
                    )
                : new Skip(
                    `The fields "dir" and "filename" are required for updating.`
                  );
            })()
          : result;
      }
    }
  );
}
