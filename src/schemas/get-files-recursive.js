import { collection } from "./";
import { capture, any, array, map, wrap, Match, Skip } from "chimpanzee";
import {
  source,
  composite,
  clean,
  permuteProps
} from "isotropy-analyzer-utils";
import R from "ramda";

export default function(state, analysisState) {
  return composite({
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: source([collection])(state, analysisState),
      property: {
        type: "Identifier",
        name: "filter"
      }
    }
  }).then(({ object: _object }) =>
    composite({
      arguments: array([
        {
          type: "ArrowFunctionExpression",
          params: capture()
        }
      ])
    }).then(({ arguments: [{ params }] }) =>
      composite(
        {
          arguments: array([
            {
              body: any(
                permuteProps(["left", "right"], {
                  type: "LogicalExpression",
                  left: any(
                    permuteProps(["left", "right"], {
                      type: "BinaryExpression",
                      left: {
                        type: "MemberExpression",
                        object: {
                          type: "Identifier",
                          name: params[0].name
                        },
                        property: {
                          type: "Identifier",
                          name: "dir"
                        }
                      },
                      operator: "===",
                      right: capture("dir")
                    }),
                    { key: "dirExpression" }
                  ),
                  operator: "||",
                  right: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: {
                        type: "MemberExpression",
                        object: {
                          type: "Identifier",
                          name: params[0].name
                        },
                        property: {
                          type: "Identifier",
                          name: "dir"
                        }
                      },
                      property: { type: "Identifier", name: "startsWith" }
                    },
                    arguments: [capture("dirStartsWith")]
                  }
                })
              )
            }
          ])
        },
        {
          build: obj => context => result => {
            return result instanceof Match
              ? (() => {
                  const dir = result.value.arguments[0].body.dirExpression.dir;
                  const dirStartsWith =
                    result.value.arguments[0].body.arguments[0];
                  return {
                    dir,
                    dirStartsWith,
                    identifier: _object.identifier,
                    path: _object.path,
                    operation: "get-files",
                    recurse: true
                  };
                })()
              : result;
          }
        }
      )
    )
  );
}
