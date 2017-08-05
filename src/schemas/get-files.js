import { root } from "./";
import { capture, any, map as mapResult,Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { getFiles } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: root(state, analysisState),
        property: {
          type: "Identifier",
          name: "filter"
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
            operator: "===",
            right: any([
              {
                type: "Identifier",
                value: capture()
              },
              mapResult(
                {
                  type: "StringLiteral",
                  value: capture()
                },
                s => s.value
              )
            ])
          }
        }
      ]
    },
    {
      build: () => () => result =>
        getFiles(
          { dir: result.value.value, recurse: false },
          result.value.object
        )
    }
  );
}
