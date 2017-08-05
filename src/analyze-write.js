import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    analyzeAssignmentExpression(path, state) {
      return makeAnalyzer([
        schemas.create, schemas.update,
        schemas.deleteFile, schemas.deleteFolder,
        schemas.moveFile, schemas.moveFolder
      ], path, state, analysisState);
    }
  };
}
