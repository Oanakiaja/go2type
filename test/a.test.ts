import { Lexer, TokenNode } from '../lib'

test('lexer basic', () => {
  const lex = new Lexer(`
/* test 
123
*/
type A struct {
  // ??
  Name string \`json:"name"\` // test
  // ??
  Age int64 \`json:"age"\` // test
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
      name: 'A',
      start: { col: 6, row: 4 },
      end: { col: 7, row: 4 }
    },
    {
      tokenType: 8,
      name: 'struct',
      start: { col: 8, row: 4 },
      end: { col: 14, row: 4 }
    },
    {
      tokenType: 12,
      name: '{',
      start: { col: 15, row: 4 },
      end: { col: 16, row: 4 }
    },
    {
      tokenType: 1,
      name: '// ??',
      start: { col: 3, row: 5 },
      end: { col: 1, row: 6 }
    },
    {
      tokenType: 4,
      name: 'Name',
      start: { col: 3, row: 6 },
      end: { col: 7, row: 6 }
    },
    {
      tokenType: 4,
      name: 'string',
      start: { col: 8, row: 6 },
      end: { col: 14, row: 6 }
    },
    {
      tokenType: 19,
      name: '`',
      start: { col: 15, row: 6 },
      end: { col: 16, row: 6 }
    },
    {
      tokenType: 4,
      name: 'json',
      start: { col: 16, row: 6 },
      end: { col: 20, row: 6 }
    },
    {
      tokenType: 18,
      name: ':',
      start: { col: 20, row: 6 },
      end: { col: 21, row: 6 }
    },
    {
      tokenType: 21,
      name: '"',
      start: { col: 21, row: 6 },
      end: { col: 22, row: 6 }
    },
    {
      tokenType: 4,
      name: 'name',
      start: { col: 22, row: 6 },
      end: { col: 26, row: 6 }
    },
    {
      tokenType: 21,
      name: '"',
      start: { col: 26, row: 6 },
      end: { col: 27, row: 6 }
    },
    {
      tokenType: 19,
      name: '`',
      start: { col: 27, row: 6 },
      end: { col: 28, row: 6 }
    },
    {
      tokenType: 1,
      name: '// test',
      start: { col: 29, row: 6 },
      end: { col: 1, row: 7 }
    },
    {
      tokenType: 1,
      name: '// ??',
      start: { col: 3, row: 7 },
      end: { col: 1, row: 8 }
    },
    {
      tokenType: 4,
      name: 'Age',
      start: { col: 3, row: 8 },
      end: { col: 6, row: 8 }
    },
    {
      tokenType: 4,
      name: 'int64',
      start: { col: 7, row: 8 },
      end: { col: 12, row: 8 }
    },
    {
      tokenType: 19,
      name: '`',
      start: { col: 13, row: 8 },
      end: { col: 14, row: 8 }
    },
    {
      tokenType: 4,
      name: 'json',
      start: { col: 14, row: 8 },
      end: { col: 18, row: 8 }
    },
    {
      tokenType: 18,
      name: ':',
      start: { col: 18, row: 8 },
      end: { col: 19, row: 8 }
    },
    {
      tokenType: 21,
      name: '"',
      start: { col: 19, row: 8 },
      end: { col: 20, row: 8 }
    },
    {
      tokenType: 4,
      name: 'age',
      start: { col: 20, row: 8 },
      end: { col: 23, row: 8 }
    },
    {
      tokenType: 21,
      name: '"',
      start: { col: 23, row: 8 },
      end: { col: 24, row: 8 }
    },
    {
      tokenType: 19,
      name: '`',
      start: { col: 24, row: 8 },
      end: { col: 25, row: 8 }
    },
    {
      tokenType: 1,
      name: '// test',
      start: { col: 26, row: 8 },
      end: { col: 1, row: 9 }
    },
    {
      tokenType: 16,
      name: '}',
      start: { col: 1, row: 9 },
      end: { col: 2, row: 9 }
    }
  ].map(obj => new TokenNode(
    obj.tokenType,
    obj.name,
    obj.start,
    obj.end
  ))));
});