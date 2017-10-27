import { collection } from "./";
import {
  capture,
  any,
  array,
  map as mapResult,
  wrap,
  Match,
  Skip
} from "chimpanzee";
import { source, composite, clean, permute } from "isotropy-analyzer-utils";
import R from "ramda";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: wrap(collection(state, analysisState), {
          key: "fs",
          selector: "path"
        }),
        property: {
          type: "Identifier",
          name: "find"
        }
      },
      arguments: array(
        [
          {
            type: "ArrowFunctionExpression",
            params: [capture("param")],
            body: any(
              permute([
                [ x=> x.left, (x, v) => ({ ...x, left: v }) ],
                [ x=> x.right, (x, v) => ({ ...x, right: v }) ]
              ],
              {
                type: "LogicalExpression",
                left: {
                  type: "BinaryExpression",
                  left: {
                    type: "MemberExpression",
                    object: capture("leftIdentifier"),
                    property: {
                      type: "Identifier",
                      name: "filename"
                    }
                  },
                  operator: "===",
                  right: capture("filename")
                },
                operator: "&&",
                right: {
                  type: "BinaryExpression",
                  left: {
                    type: "MemberExpression",
                    object: capture("rightIdentifier"),
                    property: {
                      type: "Identifier",
                      name: capture("dir")
                    }
                  },
                  operator: "===",
                  right: capture("dir")
                }
              })
              permute([
                {
                  type: "BinaryExpression",
                  left: {
                    type: "MemberExpression",
                    object: capture("leftIdentifier"),
                    property: {
                      type: "Identifier",
                      name: "filename"
                    }
                  },
                  operator: "===",
                  right: capture("filename")
                },
                {
                  type: "BinaryExpression",
                  left: {
                    type: "MemberExpression",
                    object: capture("rightIdentifier"),
                    property: {
                      type: "Identifier",
                      name: capture("dir")
                    }
                  },
                  operator: "===",
                  right: capture("dir")
                }
              ]).map(([left, right]) => ({
                type: "LogicalExpression",
                left,
                operator: "&&",
                right
              }))
            )
          }
        ],
        { key: "args" }
      )
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? (() => {
              debugger;
              const props = result.value.args[0];
              const fs = result.value.fs;

              const keyValueMap = {
                [props.key1]: clean(props.val1),
                [props.key2]: clean(props.val2)
              };
              const { dir, filename } = keyValueMap;

              return props.params[0].fsIdentifier1 === props.fsIdentifier2 &&
                props.fsIdentifier2 === props.fsIdentifier3 &&
                dir &&
                filename
                ? readFile(
                    {
                      dir: dir,
                      filename: filename
                    },
                    {
                      identifier: fs.identifier,
                      module: fs.module,
                      collection: fs.collection
                    }
                  )
                : new Skip(
                    `The "dir" and "filename" must be specified for read`
                  );
            })()
          : result
    }
  );
}
