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
import { source, composite } from "isotropy-analyzer-utils";
import R from "ramda";

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
        arguments: [capture()]
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? {
              ...result.value.right,
              operation: "create-file",
              files: result.value.arguments[0]
            }
          : result
    }
  );
}
