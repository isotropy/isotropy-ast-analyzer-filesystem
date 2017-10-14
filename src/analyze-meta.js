import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      // Incorrect config
      if (!state.opts.projects)
        return {
          error:
            "We don't understand your configuration! Please check your .babelrc."
        };

      const fsProject = state.opts.projects.find(project => {
        const projectDir = project.dir.startsWith("./")
          ? project.dir
          : "./" + project.dir;
        const absolutePath = path.resolve(projectDir);
        return state.file.opts.filename.startsWith(absolutePath);
      });

      // Not a fs project
      if (!fsProject)
        return {
          skip: "This folder is not specified for transpilation in the config."
        };

      const moduleName = babelPath.get("source").node.value;
      const resolvedName = path.resolve(
        path.dirname(state.file.opts.filename),
        moduleName
      );

      const fsModule = fsProject.modules.find(m => {
        const sourceDir = m.source.startsWith("./")
          ? m.source
          : "./" + m.source;
        const absolutePath = path.resolve(sourceDir);
        return absolutePath === resolvedName;
      });

      if (!fsModule)
        return { skip: "This import is not what we are looking for." };

      const specifier = babelPath.get("specifiers.0").node.local.name;
      analysisState.importBindings = analysisState.importBindings.concat({
        module: fsModule.locations,
        binding: babelPath.scope.bindings[specifier]
      });
      return true;
    }
  };
}
