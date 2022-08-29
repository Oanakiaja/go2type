
export type goIdentifierType =
  'uint' | 'int' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'int8' | 'int16' | 'int32'
  | 'int64' | 'float32' | 'float64' | 'byte' | 'rune' | 'string' | 'bool' | 'struct' | 'inlineStruct'

export type tsIdentifierType = 'number' | 'string' | 'boolean' | 'object' | 'inlineObject'
// 类型映射
export const numberTypeArray = [
  ['uint', 'number'],
  ['int', 'number'],
  ['uint8', 'number'],
  ['uint16', 'number'],
  ['uint32', 'number'],
  ['uint64', 'number'],
  ['int8', 'number'],
  ['int16', 'number'],
  ['int32', 'number'],
  ['int64', 'number'],
  ['float32', 'number'],
  ['float64', 'number'],
  ['byte', 'number'],
  ['rune', 'number'],
  // 不考虑 complex, uintptr 类型
] as [goIdentifierType, tsIdentifierType][]

const stringTypeArray = [
  ['string', 'string']
] as [goIdentifierType, tsIdentifierType][]

const booleanTypeArray = [
  ['bool', 'boolean']
] as [goIdentifierType, tsIdentifierType][]

const structTypeArray = [
  ['struct', 'object'],
  ['inlineStruct', 'inlineObject']
] as [goIdentifierType, tsIdentifierType][]

export const goDataType = [
  ...numberTypeArray.map(val => val[0]),
  ...stringTypeArray.map(val => val[0]),
  ...booleanTypeArray.map(val => val[0])
]

export const typeMap = new Map<goIdentifierType, tsIdentifierType>(
  [...numberTypeArray, ...stringTypeArray, ...booleanTypeArray, ...structTypeArray])
