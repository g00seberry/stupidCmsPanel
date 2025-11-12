[**admin**](../../../README.md)

***

# Variable: rest

> `const` **rest**: `object`

Defined in: [src/api/rest.ts:37](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/api/rest.ts#L37)

Унифицированный API-клиент с поддержкой автоматического обновления токенов.
Все запросы автоматически обрабатывают 401 ошибки, пытаясь обновить токены.
Использует CSRF защиту через cookies и заголовки.

## Type Declaration

### delete()

> `readonly` **delete**\<`T`\>(`url`, `config?`): `Promise`\<`AxiosResponse`\<`T`, `any`, \{ \}\>\>

Выполняет DELETE-запрос.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### url

`string`

Адрес запроса.

##### config?

`AxiosRequestConfig`\<`any`\>

Дополнительные параметры Axios.

#### Returns

`Promise`\<`AxiosResponse`\<`T`, `any`, \{ \}\>\>

Ответ Axios с данными типа `T`.

### get()

> `readonly` **get**\<`T`\>(`url`, `config?`): `Promise`\<`AxiosResponse`\<`T`, `any`, \{ \}\>\>

Выполняет GET-запрос.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### url

`string`

Адрес запроса.

##### config?

`AxiosRequestConfig`\<`any`\>

Дополнительные параметры Axios.

#### Returns

`Promise`\<`AxiosResponse`\<`T`, `any`, \{ \}\>\>

Ответ Axios с данными типа `T`.

### post()

> `readonly` **post**\<`T`, `D`\>(`url`, `data?`, `config?`): `Promise`\<`AxiosResponse`\<`T`, `any`, \{ \}\>\>

Выполняет POST-запрос.

#### Type Parameters

##### T

`T` = `unknown`

##### D

`D` = `unknown`

#### Parameters

##### url

`string`

Адрес запроса.

##### data?

`D`

Тело запроса.

##### config?

`AxiosRequestConfig`\<`any`\>

Дополнительные параметры Axios.

#### Returns

`Promise`\<`AxiosResponse`\<`T`, `any`, \{ \}\>\>

Ответ Axios с данными типа `T`.

### put()

> `readonly` **put**\<`T`, `D`\>(`url`, `data?`, `config?`): `Promise`\<`AxiosResponse`\<`T`, `any`, \{ \}\>\>

Выполняет PUT-запрос.

#### Type Parameters

##### T

`T` = `unknown`

##### D

`D` = `unknown`

#### Parameters

##### url

`string`

Адрес запроса.

##### data?

`D`

Тело запроса.

##### config?

`AxiosRequestConfig`\<`any`\>

Дополнительные параметры Axios.

#### Returns

`Promise`\<`AxiosResponse`\<`T`, `any`, \{ \}\>\>

Ответ Axios с данными типа `T`.

## Example

```ts
// GET запрос
const response = await rest.get<User>('/api/v1/users/1');
console.log(response.data);

// POST запрос
const newUser = await rest.post<User>('/api/v1/users', { name: 'John' });

// PUT запрос
const updated = await rest.put<User>('/api/v1/users/1', { name: 'Jane' });

// DELETE запрос
await rest.delete('/api/v1/users/1');
```
