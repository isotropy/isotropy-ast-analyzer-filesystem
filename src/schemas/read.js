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
import composite from "../chimpanzee-utils/composite";
import clean from "../chimpanzee-utils/node-cleaner";
import R from "ramda";
import { read } from "../fs-statements";

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
            params: [
              {
                type: "Identifier",
                name: capture("fsIdentifier1")
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
                    name: capture("fsIdentifier2")
                  },
                  property: {
                    type: "Identifier",
                    name: capture("key1")
                  }
                },
                operator: "===",
                right: capture("val1")
              },
              operator: "&&",
              right: {
                type: "BinaryExpression",
                left: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: capture("fsIdentifier3")
                  },
                  property: {
                    type: "Identifier",
                    name: capture("key2")
                  }
                },
                operator: "===",
                right: capture("val2")
              }
            }
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
              return props.params[0].fsIdentifier1 === props.fsIdentifier2 &&
              props.fsIdentifier2 === props.fsIdentifier3 &&
              props.key1 !== props.key2 &&
              [props.key1, props.key2].every((v, i) =>
                ["dir", "filename"].includes(v)
              )
                ? read(
                    {
                      [props.key1]: clean(props.val1),
                      [props.key2]: clean(props.val2)
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
