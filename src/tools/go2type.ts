import { Go2Type } from "../../lib";
import prettier from "prettier";
import parserTypescript from "prettier/parser-typescript";

export const InputSource = `/** 
* Hello !
* This is a interface transpiler
*/
type Height int // comment
type Person struct { 
  Name *string \`json:"name"\` // 姓名
  Age uint8 \`json: "age"\`  
  Height Height \`json:"height"\`  
  Birthday uint8 \`json:"birthday, omitempty"\` 
  Parents []Person \`json:"parents, omitempty"\`
  School map[int64]struct { 
    MiddleSchool string  \`json: "middle_school, omitempty"\`
    HighSchool string  \`json: "high_school, omitempty"\`
    College string  \`json: "college, omitempty"\`
  } \`json: "school, omitempty"\`
}`;

export const getGo2TypeContent = (source: string, prettierConfig?: Omit<prettier.Options,'parser'|'plugins'>) => {
  try {
    const parse_code = new Go2Type(source).transpiler();
    const format_code = prettier.format(parse_code, {
      parser: "typescript",
      plugins: [parserTypescript],
      ...(prettierConfig ?? {}),
    });
    return { code: format_code, error: null };
  } catch (e) {
    return {
      code: null,
      error: e,
    };
  }
};
