import './app.css'
import { CodeJar } from "https://medv.io/codejar/codejar.js";
import prettier from "https://unpkg.com/prettier@2.7.1/esm/standalone.mjs";
import parserTypescript from "https://unpkg.com/prettier@2.7.1/esm/parser-typescript.mjs";
import { Go2Type } from '../lib'

const highlight = (editor) => {
  // highlight.js does not trims old tags,
  // let's do it by this hack.
  editor.textContent = editor.textContent;
  hljs.highlightBlock(editor);
};

const languages = (editor, jar, language) => {
  editor.className = `editor language-${language}`;
  jar.updateCode(``);
  jar.updateOptions({ tab: "  " });
};

const create_editor = (language, source) => {
  const editor = document.querySelector(`.${language}-editor`)
  const jar = new CodeJar(editor, highlight);
  languages(editor, jar, language)
  return jar
}

const create_style = () => {
  let currentStyle = 1;
  const styles = [
    "dracula",
    "github",
    "solarized-dark",
    "solarized-light",
    "railscasts",
    "monokai-sublime",
    "mono-blue",
    "tomorrow",
    "color-brewer",
    "zenburn",
    "agate",
    "androidstudio",
    "atom-one-light",
    "rainbow",
    "vs",
    "atom-one-dark"
  ].map((name) => {
    const link = document.createElement("link");
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/${name}.min.css`;
    link.rel = "stylesheet";
    link.disabled = "true";
    document.head.appendChild(link);
    return link;
  });
  styles[currentStyle].removeAttribute("disabled");
  // const switchStyleButton = document.querySelector(`.switch-style`);

  // switchStyleButton.addEventListener("click", (event) => {
  //   event.preventDefault();

  //   styles[currentStyle].setAttribute("disabled", "true");
  //   currentStyle = (currentStyle + 1) % styles.length;
  //   styles[currentStyle].removeAttribute("disabled");

  //   let [, name] = styles[currentStyle].href.match(
  //     /highlight.js.+?\/styles\/(.+?)\.min\.css$/
  //   );
  //   switchStyleButton.textContent = name;
  // });

}

const error = document.querySelector('.error')


const transpilerJar = async (code) => {
  try {
    const parse_code = new Go2Type(code).transpiler()
    if (parse_code) {
      const format_code = prettier.format(parse_code, {
        parser: "typescript",
        plugins: [parserTypescript],
      });
      ts_jar.updateCode(format_code)
    }
    error.textContent = ""
  }
  catch (e) {
    error.textContent = e
  }
}

const ts_jar = create_editor('ts')
const go_jar = create_editor('go')
create_style()
go_jar.updateCode(`/* test 
* 123
*/
type Height int // comment
type Person struct {
  Name *string \`json:"name"\` //  comment
  Age uint8 // comment
  Height Height  // comment
  Birthday uint8  // comment
  Parents []Person 
  School map[string]struct {
    MiddleSchool string
    HighSchool string
    College string 
  }
}`)

transpilerJar(go_jar.toString())


go_jar.onUpdate(transpilerJar)
