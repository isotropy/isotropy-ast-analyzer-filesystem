import { source } from "../chimpanzee-utils";
import { module } from "./";
import { capture, any, Match, Skip } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { getFiles } from "../fs-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([module])(state, analysisState),
        property: {
          type: "Identifier",
          name: "filter"
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
          any([
            mapResult(
              right: {
                type: "StringLiteral",
                value: capture()
              },
              s => s.value
            ),
            right: {
              type: "Identifier",
              value: capture()
            }
          ])
        }
      ]
    },
    {
      build: () => () => result =>
        getFiles(
          { "dir": result.value.value, recurse: false },
          result.value.object
        )
    }
  );
}
