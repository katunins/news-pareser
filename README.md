# News Parser с Selenium

Проект для парсинга div элементов с сайта https://ikatunin.ru с использованием Selenium WebDriver в Docker контейнерах.

## Архитектура

Проект состоит из следующих сервисов:
- **selenium-hub** - Selenium Grid Hub для управления браузерами
- **chrome** - Chrome браузер для Selenium
- **firefox** - Firefox браузер для Selenium  
- **app** - Node.js приложение с парсером

## Запуск

### 1. Сборка и запуск всех сервисов

```bash
docker-compose up --build
```

### 2. Запуск только Selenium Grid (без приложения)

```bash
docker-compose up selenium-hub chrome firefox
```

### 3. Запуск приложения отдельно (если Selenium уже запущен)

```bash
docker-compose up app
```

## Мониторинг

- **Selenium Grid Console**: http://localhost:4444/ui
- **Selenium Hub**: http://localhost:4444/wd/hub

## Логи

Для просмотра логов конкретного сервиса:

```bash
# Логи приложения
docker-compose logs app

# Логи Selenium Hub
docker-compose logs selenium-hub

# Логи Chrome браузера
docker-compose logs chrome

# Все логи
docker-compose logs
```

## Остановка

```bash
docker-compose down
```

## Пересборка

```bash
docker-compose down
docker-compose up --build
```

## Что делает приложение

1. Подключается к Selenium Grid Hub
2. Открывает Chrome браузер
3. Переходит на сайт https://ikatunin.ru
4. Находит все div элементы на странице
5. Выводит информацию о каждом div в консоль:
   - Tag name
   - Class атрибут
   - ID атрибут
   - Текст (первые 100 символов)
   - Количество вложенных элементов

## Требования

- Docker
- Docker Compose
