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
    type: "AssignmentExpression",
    operator: "=",
    left: source([collection])(state, analysisState),
    right: {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection])(state, analysisState),
        property: {
          type: "Identifier",
          name: "filter"
        }
      }
    }
  }).then(({ object: _object }) =>
    composite({
      right: {
        arguments: array([
          {
            type: "ArrowFunctionExpression",
            params: capture()
          }
        ])
      }
    }).then(({ arguments: [{ params }] }) =>
      composite(
        {
          right: {
            arguments: array([
              {
                body: {
                  type: "UnaryExpression",
                  operator: "!",
                  argument: any(
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
                              name: "filename"
                            }
                          },
                          operator: "===",
                          right: capture("filename")
                        }),
                        { key: "filenameExpression" }
                      ),
                      operator: "&&",
                      right: any(
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
                              name: capture("dir")
                            }
                          },
                          operator: "===",
                          right: capture("dir")
                        }),
                        { key: "dirExpression" }
                      )
                    })
                  )
                }
              }
            ])
          }
        },
        {
          build: obj => context => result =>
            result instanceof Match
              ? {
                  filename:
                    result.value.arguments[0].argument.filenameExpression
                      .filename,
                  dir: result.value.arguments[0].argument.dirExpression.dir,
                  identifier: _object.identifier,
                  path: _object.path,
                  operation: "delete-file"
                }
              : result
        }
      )
    )
  );
}
