import {
  Lexer,
  TokenNode,
  Pos
} from '../lib'

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
     MiddleSchool,HighSchool,College string
   }
}
`)

  expect(JSON.stringify(lex.scan())).toBe(JSON.stringify([
    {
      tokenType: 1,
      name: '/* test \n123\n*/',
      start: { row: 1, col: 0 },
      end: { row: 3, col: 2 }
    },
    {
      tokenType: 6,
      name: 'type',
      start: { row: 4, col: 0 },
      end: { row: 4, col: 4 }
    },
    {
      tokenType: 3,
      name: 'Height',
      start: { row: 4, col: 5 },
      end: { row: 4, col: 11 }
    },
    {
      tokenType: 3,
      name: 'int',
      start: { row: 4, col: 12 },
      end: { row: 4, col: 15 }
    },
    {
      tokenType: 1,
      name: '// comment',
      start: { row: 4, col: 16 },
      end: { row: 5, col: 0 }
    },
    {
      tokenType: 6,
      name: 'type',
      start: { row: 5, col: 0 },
      end: { row: 5, col: 4 }
    },
    {
      tokenType: 3,
      name: 'Person',
      start: { row: 5, col: 5 },
      end: { row: 5, col: 11 }
    },
    {
      tokenType: 7,
      name: 'struct',
      start: { row: 5, col: 12 },
      end: { row: 5, col: 18 }
    },
    {
      tokenType: 11,
      name: '{',
      start: { row: 5, col: 19 },
      end: { row: 5, col: 20 }
    },
    {
      tokenType: 3,
      name: 'Name',
      start: { row: 6, col: 3 },
      end: { row: 6, col: 7 }
    },
    {
      tokenType: 3,
      name: 'string',
      start: { row: 6, col: 8 },
      end: { row: 6, col: 14 }
    },
    {
      tokenType: 1,
      name: '//  comment',
      start: { row: 6, col: 16 },
      end: { row: 7, col: 0 }
    },
    {
      tokenType: 3,
      name: 'Age',
      start: { row: 7, col: 3 },
      end: { row: 7, col: 6 }
    },
    {
      tokenType: 3,
      name: 'uint8',
      start: { row: 7, col: 7 },
      end: { row: 7, col: 12 }
    },
    {
      tokenType: 1,
      name: '// comment',
      start: { row: 7, col: 13 },
      end: { row: 8, col: 0 }
    },
    {
      tokenType: 3,
      name: 'Height',
      start: { row: 8, col: 3 },
      end: { row: 8, col: 9 }
    },
    {
      tokenType: 3,
      name: 'Height',
      start: { row: 8, col: 10 },
      end: { row: 8, col: 16 }
    },
    {
      tokenType: 1,
      name: '// comment',
      start: { row: 8, col: 18 },
      end: { row: 9, col: 0 }
    },
    {
      tokenType: 3,
      name: 'Birthday',
      start: { row: 9, col: 3 },
      end: { row: 9, col: 11 }
    },
    {
      tokenType: 3,
      name: 'uint8',
      start: { row: 9, col: 12 },
      end: { row: 9, col: 17 }
    },
    {
      tokenType: 18,
      name: '`',
      start: { row: 9, col: 18 },
      end: { row: 9, col: 19 }
    },
    {
      tokenType: 3,
      name: 'json',
      start: { row: 9, col: 19 },
      end: { row: 9, col: 23 }
    },
    {
      tokenType: 17,
      name: ':',
      start: { row: 9, col: 23 },
      end: { row: 9, col: 24 }
    },
    {
      tokenType: 20,
      name: '"',
      start: { row: 9, col: 24 },
      end: { row: 9, col: 25 }
    },
    {
      tokenType: 3,
      name: 'birthday',
      start: { row: 9, col: 25 },
      end: { row: 9, col: 33 }
    },
    {
      tokenType: 20,
      name: '"',
      start: { row: 9, col: 33 },
      end: { row: 9, col: 34 }
    },
    {
      tokenType: 18,
      name: '`',
      start: { row: 9, col: 34 },
      end: { row: 9, col: 35 }
    },
    {
      tokenType: 1,
      name: '// comment',
      start: { row: 9, col: 37 },
      end: { row: 10, col: 0 }
    },
    {
      tokenType: 3,
      name: 'Parents',
      start: { row: 10, col: 3 },
      end: { row: 10, col: 10 }
    },
    {
      tokenType: 10,
      name: '[',
      start: { row: 10, col: 11 },
      end: { row: 10, col: 12 }
    },
    {
      tokenType: 14,
      name: ']',
      start: { row: 10, col: 12 },
      end: { row: 10, col: 13 }
    },
    {
      tokenType: 3,
      name: 'Person',
      start: { row: 10, col: 13 },
      end: { row: 10, col: 19 }
    },
    {
      tokenType: 3,
      name: 'School',
      start: { row: 11, col: 3 },
      end: { row: 11, col: 9 }
    },
    {
      tokenType: 7,
      name: 'struct',
      start: { row: 11, col: 10 },
      end: { row: 11, col: 16 }
    },
    {
      tokenType: 11,
      name: '{',
      start: { row: 11, col: 17 },
      end: { row: 11, col: 18 }
    },
    {
      tokenType: 3,
      name: 'MiddleSchool',
      start: { row: 12, col: 5 },
      end: { row: 12, col: 17 }
    },
    {
      tokenType: 12,
      name: ',',
      start: { row: 12, col: 17 },
      end: { row: 12, col: 18 }
    },
    {
      tokenType: 3,
      name: 'HighSchool',
      start: { row: 12, col: 18 },
      end: { row: 12, col: 28 }
    },
    {
      tokenType: 12,
      name: ',',
      start: { row: 12, col: 28 },
      end: { row: 12, col: 29 }
    },
    {
      tokenType: 3,
      name: 'College',
      start: { row: 12, col: 29 },
      end: { row: 12, col: 36 }
    },
    {
      tokenType: 3,
      name: 'string',
      start: { row: 12, col: 37 },
      end: { row: 12, col: 43 }
    },
    {
      tokenType: 15,
      name: '}',
      start: { row: 13, col: 3 },
      end: { row: 13, col: 4 }
    },
    {
      tokenType: 15,
      name: '}',
      start: { row: 14, col: 0 },
      end: { row: 14, col: 1 }
    }
  ].map(obj => new TokenNode(
    obj.tokenType,
    obj.name,
    new Pos(obj.start.row, obj.start.col),
    new Pos(obj.end.row, obj.end.col)
  ))));
});