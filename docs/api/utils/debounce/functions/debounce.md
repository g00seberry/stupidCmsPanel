[**admin**](../../../README.md)

***

# Function: debounce()

> **debounce**\<`T`, `A`\>(`fn`): (`delay`, `args`) => `Promise`\<`T`\>

Defined in: [src/utils/debounce.ts:6](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/utils/debounce.ts#L6)

Создаёт debounced-версию функции, откладывающую выполнение на указанную задержку.

## Type Parameters

### T

`T`

### A

`A`

## Parameters

### fn

(`args`) => `T`

Функция, которую необходимо debounce.

## Returns

Функция, принимающая задержку и аргументы, возвращающая Promise с результатом выполнения.

> (`delay`, `args`): `Promise`\<`T`\>

### Parameters

#### delay

`number`

#### args

`A`

### Returns

`Promise`\<`T`\>
