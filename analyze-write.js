import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    analyzeAssignmentExpression(path, state) {
      return makeAnalyzer([
        schemas.create, schemas.update,
        schemas.delete-file, schemas.delete-folder,
        schemas.move-file, schemas.move-folder
      ], path, state, analysisState);
    }
  };
}
