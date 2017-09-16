import { collection } from "./";
import {
  capture,
  any,
  array,
  repeatingItem,
  map as mapResult,
  Match,
  wrap,
  Skip
} from "chimpanzee";
import { source } from "../chimpanzee-utils";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { createFile } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: wrap(collection(state, analysisState), {
        key: "left",
        selector: "path"
      }),
      right: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: wrap(collection(state, analysisState), {
            key: "right",
            selector: "path"
          }),
          property: {
            type: "Identifier",
            name: "concat"
          }
        },
        arguments: array(
          [
            {
              type: "ObjectExpression",
              properties: array([
                repeatingItem({
                  type: "ObjectProperty",
                  key: {
                    type: "Identifier",
                    name: capture("key")
                  },
                  value: capture("value")
                })
              ])
            }
          ],
          { key: "args" }
        )
      }
    },
    {
      build: obj => context => result => {
        return result instanceof Match
          ? (() => {
              const source = result.value.left;
              const props = result.value.args[0].properties;
              let contentsNode, dirNode, filenameNode;
              props.forEach(prop => {
                if (prop.key === "contents") contentsNode = prop.value;
                if (prop.key === "dir") dirNode = prop.value;
                if (prop.key === "filename") filenameNode = prop.value;
              });
              return R.equals(result.value.left, result.value.right)
                ? contentsNode && dirNode && filenameNode
                  ? createFile(
                      {
                        contentsNode,
                        dirNode,
                        filenameNode
                      },
                      {
                        identifier: source.identifier,
                        module: source.module.path,
                        collection: source.collection
                      }
                    )
                  : new Skip(
                      `File creation must be accompanied by three values:
                  "dir", "filename", "contents"`
                    )
                : new Skip(
                    `The result of the concat() must be assigned to the fs module`
                  );
            })()
          : result;
      }
    }
  );
}
