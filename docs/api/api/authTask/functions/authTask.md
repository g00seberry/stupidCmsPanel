[**admin**](../../../README.md)

***

# Function: authTask()

> **authTask**\<`R`\>(`task`): `Promise`\<`R`\>

Defined in: [src/api/authTask.ts:25](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/api/authTask.ts#L25)

Выполняет запрос к API с автоматическим обновлением токенов при 401 ответе.
Предотвращает параллельные запросы на обновление токенов через механизм блокировки.
Если после обновления токенов запрос всё ещё возвращает 401, пользователь разлогинивается.

## Type Parameters

### R

`R` *extends* [`ApiResponseWithStatus`](../type-aliases/ApiResponseWithStatus.md)

## Parameters

### task

() => `Promise`\<`R`\>

Функция, выполняющая HTTP-запрос.

## Returns

`Promise`\<`R`\>

Ответ API после возможного обновления токенов.

## Throws

Если обновить токены не удалось или пользователь не авторизован.

## Example

```ts
const response = await authTask(() => axios.get('/api/v1/protected'));
// Если получили 401, токены автоматически обновятся и запрос повторится
```
