import { capture, wrap, Match } from "chimpanzee";
import { createCollection } from "../fs-statements";
import { root } from "./";
import composite from "../chimpanzee-utils/composite";

export default function(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: wrap(root(state, analysisState), {
        key: "root",
        selector: "path"
      }),
      property: {
        type: "Identifier",
        name: capture("collection")
      }
    },
    {
      build: obj => context => result => {
        return result instanceof Match
          ? createCollection({
              identifier: result.value.root.identifier,
              // Returns only the module location associated with the identified collection
              module: result.value.root.module.find(
                m => m.name === result.value.collection
              ),
              collection: result.value.collection
            })
          : result;
      }
    }
  );
}
