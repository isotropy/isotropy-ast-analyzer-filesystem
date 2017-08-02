import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    analyzeCallExpression(path, state) {
      return makeAnalyzer(
        [schemas.get-files, schemas.get-files-r, schemas.read],
        path,
        state,
        analysisState
      );
    },
  };
}
