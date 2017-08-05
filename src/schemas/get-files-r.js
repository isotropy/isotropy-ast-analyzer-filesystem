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
import { getFiles } from "../fs-statements";

export default function(state, analysisState) {
  const dir = {
    type: "BinaryExpression",
    left: {
      type: "MemberExpression",
      object: {
        type: "Identifier",
        name: capture("fsIdentifier2")
      },
      property: {
        type: "Identifier",
        name: "dir"
      }
    },
    operator: "===",
    right: capture("dirNode1")
  };

  const dirStartsWith = {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: capture("fsIdentifier3")
        },
        property: {
          type: "Identifier",
          name: "dir"
        }
      },
      property: {
        type: "Identifier",
        name: "startsWith"
      }
    },
    arguments: [capture("dirNode2")]
  };

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
          name: "filter"
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
            body: any([
              {
                type: "LogicalExpression",
                left: dir,
                operator: "||",
                right: dirStartsWith
              },
              {
                type: "LogicalExpression",
                left: dirStartsWith,
                operator: "||",
                right: dir
              }
            ])
          }
        ],
        { key: "args" }
      )
    },
    {
      build: () => () => result => {
        return result instanceof Match
          ? (() => {
              const fs = result.value.fs;
              debugger;
              return R.equals(
                clean(result.value.args[0].body.dirNode1),
                clean(result.value.args[0].body.arguments[0])
              )
                ? result.value.args[0].params[0].fsIdentifier1 &&
                    result.value.args[0].body.fsIdentifier2 ===
                      result.value.args[0].body.fsIdentifier3
                  ? getFiles(
                      {
                        dir: clean(result.value.args[0].body.dirNode1),
                        recurse: true
                      },
                      {
                        identifier: fs.identifier,
                        module: fs.module,
                        collection: fs.collection
                      }
                    )
                  : new Skip(
                      `The fs access identifier should be the same across all instances.`
                    )
                : new Skip(
                    `The directory names should be the same to perform a
            recursive traversal to list all files.`
                  );
            })()
          : result;
      }
    }
  );
}
