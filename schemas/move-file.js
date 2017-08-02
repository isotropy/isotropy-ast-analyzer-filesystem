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
                name: capture("key3")
              },
              any([
                value: {
                  type: "StringLiteral",
                  value: capture("val3")
                },
                value: {
                  type: "Identifier",
                  value: capture("val3")
                }
              ])
            },
            ObjectProperty: {
              type: "ObjectProperty",
              key: {
                type: "Identifier",
                name: capture("key4")
              },
              any([
                value: {
                  type: "StringLiteral",
                  value: capture("val4")
                },
                value: {
                  type: "Identifier",
                  value: capture("val4")
                }
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
        const shouldContain = ["dir", "filename"]
        const mapKeys = [result.value.key1, result.value.key2]
        const updateKeys = [result.value.key3, result.value.key4]

        return result instanceof Match
          ? R.equals(result.value.left, result.value.object)
            ? mapKeys[0] !== mapKeys[1] && updateKeys[0] !== updateKeys[1]
              && mapKeys.every((v, i) => shouldContain.includes(v.key))
              && updateKeys.every((v, i) => shouldContain.includes(v.key))
              ? move({ ...result.value.object,
                [result.value.key1]: result.value.val1,
                [result.value.key2]: result.value.val2,
                [result.value.key3]: result.value.val3,
                [result.value.key4]: result.value.val4 },
                result.value.left)
                : new Skip(`The result of the map() must be assigned to the same fs module.`)
              : new Skip(`The required fields under "dir" and "filename must be populated."`)
          : result
      }
    }
  );
}
