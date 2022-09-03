import {
  Lexer,
} from '../lib'

test('lexer basic', () => {
   new Lexer(`
/* test 
123
*/
type Height int // comment
type Person struct {
  Name string  //  comment
  Age uint8 // comment
  Height Height  // comment
  Birthday uint8 \`json:"birthday"\`  // comment
  Parents []Person 
  School struct {
    MiddleSchool,HighSchool,College string
  }
}
`)
  // TODO: 
  expect(true).toBe(true)
});