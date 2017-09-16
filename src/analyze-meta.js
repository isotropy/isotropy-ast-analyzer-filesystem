import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      debugger;

      const moduleName = babelPath.get("source").node.value;
      const resolvedName = path.resolve(
        path.dirname(state.file.opts.filename),
        moduleName
      );

      let absolutePath = null;

      const fsProject = state.opts.projects.find(project => {
        const projectDir = project.dir.startsWith("./")
          ? project.dir
          : "./" + project.dir;
        absolutePath = path.resolve(projectDir) + "/";
        return resolvedName.startsWith(absolutePath);
      });

      if (!fsProject) return false;
      fsProject.absolutePath = absolutePath;

      const fsModule = fsProject.modules.find(m => {
        absolutePath =
          (fsProject.absolutePath + m.source).replace(/\/\//g, "/") + "/";
        return resolvedName.startsWith(absolutePath);
      });

      if (!fsModule) return false;
      fsModule.absolutePath = absolutePath;

      const specifier = babelPath.get("specifiers.0").node.local.name;
      analysisState.importBindings = analysisState.importBindings.concat({
        locations: fsModule.locations.map(location => ({
          ...location,
          path: (fsModule.absolutePath + location.path).replace(/\/\//g, "/")
        })),
        binding: babelPath.scope.bindings[specifier]
      });
      return true;
    }
  };
}
