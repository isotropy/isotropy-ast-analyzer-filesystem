import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      const fsModules = Object.keys(state.opts.filesystemModules).map(key => ({
        key,
        value: path.resolve(state.opts.filesystemModules[key])
      }));

      const moduleName = babelPath.get("source").node.value;
      const resolvedName = path.resolve(path.dirname(state.file.opts.filename), moduleName);

      const fsModule = fsModules.find(p => p.value === resolvedName);
      if (fsModule) {
        const specifier = babelPath.get("specifiers.0").node.local.name;
        analysisState.importBindings = analysisState.importBindings.concat({
          module: fsModule.key,
          binding: babelPath.scope.bindings[specifier]
        });
      }
    }
  };
}
