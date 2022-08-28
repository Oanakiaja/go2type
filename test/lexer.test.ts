import { Lexer, TokenNode } from '../lib'

test('lexer basic', () => {
  const lex = new Lexer(`
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
     MiddleSchool string
     HighSchool string
     College string
   }
}
`)
  expect(JSON.stringify(lex.scan())).toBe(JSON.stringify([
    {
      tokenType: 1,
      name: '/* test \n123\n*/',
      start: { col: 1, row: 1 },
      end: { col: 3, row: 3 }
    },
    {
      tokenType: 7,
      name: 'type',
      start: { col: 1, row: 4 },
      end: { col: 5, row: 4 }
    },
    {
      tokenType: 4,
      name: 'Height',
      start: { col: 6, row: 4 },
      end: { col: 12, row: 4 }
    },
    {
      tokenType: 4,
      name: 'int',
      start: { col: 13, row: 4 },
      end: { col: 16, row: 4 }
    },
    {
      tokenType: 1,
      name: '// comment',
      start: { col: 17, row: 4 },
      end: { col: 1, row: 5 }
    },
    {
      tokenType: 7,
      name: 'type',
      start: { col: 1, row: 5 },
      end: { col: 5, row: 5 }
    },
    {
      tokenType: 4,
      name: 'Person',
      start: { col: 6, row: 5 },
      end: { col: 12, row: 5 }
    },
    {
      tokenType: 8,
      name: 'struct',
      start: { col: 13, row: 5 },
      end: { col: 19, row: 5 }
    },
    {
      tokenType: 12,
      name: '{',
      start: { col: 20, row: 5 },
      end: { col: 21, row: 5 }
    },
    {
      tokenType: 4,
      name: 'Name',
      start: { col: 4, row: 6 },
      end: { col: 8, row: 6 }
    },
    {
      tokenType: 4,
      name: 'string',
      start: { col: 9, row: 6 },
      end: { col: 15, row: 6 }
    },
    {
      tokenType: 1,
      name: '//  comment',
      start: { col: 17, row: 6 },
      end: { col: 1, row: 7 }
    },
    {
      tokenType: 4,
      name: 'Age',
      start: { col: 4, row: 7 },
      end: { col: 7, row: 7 }
    },
    {
      tokenType: 4,
      name: 'uint8',
      start: { col: 8, row: 7 },
      end: { col: 13, row: 7 }
    },
    {
      tokenType: 1,
      name: '// comment',
      start: { col: 14, row: 7 },
      end: { col: 1, row: 8 }
    },
    {
      tokenType: 4,
      name: 'Height',
      start: { col: 4, row: 8 },
      end: { col: 10, row: 8 }
    },
    {
      tokenType: 4,
      name: 'Height',
      start: { col: 11, row: 8 },
      end: { col: 17, row: 8 }
    },
    {
      tokenType: 1,
      name: '// comment',
      start: { col: 19, row: 8 },
      end: { col: 1, row: 9 }
    },
    {
      tokenType: 4,
      name: 'Birthday',
      start: { col: 4, row: 9 },
      end: { col: 12, row: 9 }
    },
    {
      tokenType: 4,
      name: 'uint8',
      start: { col: 13, row: 9 },
      end: { col: 18, row: 9 }
    },
    {
      tokenType: 19,
      name: '`',
      start: { col: 19, row: 9 },
      end: { col: 20, row: 9 }
    },
    {
      tokenType: 4,
      name: 'json',
      start: { col: 20, row: 9 },
      end: { col: 24, row: 9 }
    },
    {
      tokenType: 18,
      name: ':',
      start: { col: 24, row: 9 },
      end: { col: 25, row: 9 }
    },
    {
      tokenType: 21,
      name: '"',
      start: { col: 25, row: 9 },
      end: { col: 26, row: 9 }
    },
    {
      tokenType: 4,
      name: 'birthday',
      start: { col: 26, row: 9 },
      end: { col: 34, row: 9 }
    },
    {
      tokenType: 21,
      name: '"',
      start: { col: 34, row: 9 },
      end: { col: 35, row: 9 }
    },
    {
      tokenType: 19,
      name: '`',
      start: { col: 35, row: 9 },
      end: { col: 36, row: 9 }
    },
    {
      tokenType: 1,
      name: '// comment',
      start: { col: 38, row: 9 },
      end: { col: 1, row: 10 }
    },
    {
      tokenType: 4,
      name: 'Parents',
      start: { col: 4, row: 10 },
      end: { col: 11, row: 10 }
    },
    {
      tokenType: 11,
      name: '[',
      start: { col: 12, row: 10 },
      end: { col: 13, row: 10 }
    },
    {
      tokenType: 15,
      name: ']',
      start: { col: 13, row: 10 },
      end: { col: 14, row: 10 }
    },
    {
      tokenType: 4,
      name: 'Person',
      start: { col: 14, row: 10 },
      end: { col: 20, row: 10 }
    },
    {
      tokenType: 4,
      name: 'School',
      start: { col: 4, row: 11 },
      end: { col: 10, row: 11 }
    },
    {
      tokenType: 8,
      name: 'struct',
      start: { col: 11, row: 11 },
      end: { col: 17, row: 11 }
    },
    {
      tokenType: 12,
      name: '{',
      start: { col: 18, row: 11 },
      end: { col: 19, row: 11 }
    },
    {
      tokenType: 4,
      name: 'MiddleSchool',
      start: { col: 6, row: 12 },
      end: { col: 18, row: 12 }
    },
    {
      tokenType: 4,
      name: 'string',
      start: { col: 19, row: 12 },
      end: { col: 25, row: 12 }
    },
    {
      tokenType: 4,
      name: 'HighSchool',
      start: { col: 6, row: 13 },
      end: { col: 16, row: 13 }
    },
    {
      tokenType: 4,
      name: 'string',
      start: { col: 17, row: 13 },
      end: { col: 23, row: 13 }
    },
    {
      tokenType: 4,
      name: 'College',
      start: { col: 6, row: 14 },
      end: { col: 13, row: 14 }
    },
    {
      tokenType: 4,
      name: 'string',
      start: { col: 14, row: 14 },
      end: { col: 20, row: 14 }
    },
    {
      tokenType: 16,
      name: '}',
      start: { col: 4, row: 15 },
      end: { col: 5, row: 15 }
    },
    {
      tokenType: 16,
      name: '}',
      start: { col: 1, row: 16 },
      end: { col: 2, row: 16 }
    }
  ].map(obj => new TokenNode(
    obj.tokenType,
    obj.name,
    obj.start,
    obj.end
  ))));
});