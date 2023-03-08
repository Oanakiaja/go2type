export const initMonacoWorkerConfig = () => {
  window.MonacoEnvironment = {
    getWorker: function (_workerId: string, label: string) {
      const getWorkerModule = (moduleUrl: string, label: string) => {
        return new Worker(window.MonacoEnvironment?.getWorkerUrl?.(moduleUrl, label)!, {
          name: label,
          type: 'module'
        });
      };

      switch (label) {
        case 'json':
          return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
        case 'css':
        case 'scss':
        case 'less':
          return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
        case 'html':
        case 'handlebars':
        case 'razor':
          return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
        case 'typescript':
        case 'javascript':
          return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
        default:
          return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
      }
    }
  }
}
