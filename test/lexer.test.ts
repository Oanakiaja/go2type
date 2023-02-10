import {
  Lexer,
} from '../lib'

test('lexer basic', () => {
  const lex = new Lexer(
    `/* test 
* 123
*/
type Height int // comment
type Person struct {
  Name *string \`json:"name"\` //  comment
  Age uint8 // comment
  Height Height  // comment
  Birthday uint8  // comment
  Parents []Person 
  School struct {
    MiddleSchool,HighSchool,College string
  }
}`)
  // TODO: 
  console.log(lex.scan())
  expect(true).toBe(true)
});