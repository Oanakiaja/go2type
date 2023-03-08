import * as monaco from 'monaco-editor'
import {
  onMount
} from "solid-js";

import { getGo2TypeContent, InputSource } from './tools/go2type'
import Header from './components/Header'
import { notificationService } from '@hope-ui/solid'

const showNotification = () => {
  notificationService.show({
    title: "Copy Successfully",
    description: `awesome! 😍`,
  })
}

const App = () => {

  onMount(async () => {
    const goE = createMonacoEditor('go', InputSource)
    const typescriptE = createMonacoEditor('typescript', getGo2TypeContent(InputSource)?.code ?? "")
    if (!goE || !typescriptE) return

    goE.onDidChangeModelContent(() => {
      const result = getGo2TypeContent(goE.getValue())
      if (result.error) {
        typescriptE.setValue(`// ${result.error}`)
      } else {
        typescriptE.setValue(result?.code ?? '')
      }
    })
  });

  const createMonacoEditor = (lang: 'go' | 'typescript', defualt: string) => {
    if (!document.getElementById(`${lang}-editor`)) {
      return
    }
    const editor = monaco.editor.create(
      document.getElementById(`${lang}-editor`)!,
      {
        value: defualt,
        language: lang,
        theme: 'vs',
        automaticLayout: true,
      });

    if (!editor.getModel()) return

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const value = editor.getValue()
      const type = "text/plain";
      const blob = new Blob([value], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      navigator.clipboard
        .write(data)
        .then(
          () => showNotification()
        );
    })

    return editor
  }

  return <div>
    <Header />
    <div class="flex h-[calc(100vh-52px)]">
      <div id="go-editor" class='h-[100%] w-[50vw]' ></div>
      <div id="typescript-editor" class='h-[100%] w-[50vw]'></div>
    </div>
  </div>
};

export default App