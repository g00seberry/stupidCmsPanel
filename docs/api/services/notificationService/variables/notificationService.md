[**admin**](../../../README.md)

***

# Variable: notificationService

> `const` **notificationService**: `object`

Defined in: [src/services/notificationService.ts:10](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/services/notificationService.ts#L10)

Сервис интеграции с уведомлениями Ant Design.

## Type Declaration

### setApi()

> `readonly` **setApi**: (`value`) => `void`

Сохраняет экземпляр API уведомлений для дальнейшего использования.

#### Parameters

##### value

Экземпляр API или `null`, если доступ нужно очистить.

`NotificationInstance` | `null`

#### Returns

`void`

### showError()

> `readonly` **showError**: (`config`) => `void`

Показывает уведомление об ошибке, используя доступный API или глобальный fallback.

#### Parameters

##### config

`ArgsProps`

Параметры уведомления.

#### Returns

`void`

### showSuccess()

> `readonly` **showSuccess**: (`config`) => `void`

Показывает уведомление об успешном завершении операции.

#### Parameters

##### config

`ArgsProps`

Параметры уведомления.

#### Returns

`void`
