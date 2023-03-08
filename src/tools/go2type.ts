import { Go2Type } from "../../lib";
import prettier from "prettier";
import parserTypescript from "prettier/parser-typescript";

export const InputSource = `/** 
* Hello !
* This is a interface transpiler
*/
type Height int // comment
type Person struct {
  Name *string \`json:"name"\` //  comment
  Age uint8 \`json: "age"\`  // comment
  Height Height  // comment
  Birthday uint8  // comment
  Parents []Person 
  School map[int64]struct {
    MiddleSchool string
    HighSchool string
    College string 
  }
}`;

export const getGo2TypeContent = (source: string) => {
  try {
    const parse_code = new Go2Type(source).transpiler();
    const format_code = prettier.format(parse_code, {
      parser: "typescript",
      plugins: [parserTypescript],
    });
    return { code: format_code, error: null };
  } catch (e) {
    return {
      code: null,
      error: e,
    };
  }
};
