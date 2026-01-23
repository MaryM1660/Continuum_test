# Git Workflow для проекта

## Текущая структура

- **main** - основная ветка с рабочим кодом
- Remote: `https://github.com/MaryM1660/Continuum_test.git`

## Рекомендуемый workflow

### Создание новой ветки для фичи

```bash
# Создать и переключиться на новую ветку
git checkout -b feature/название-фичи

# Или для исправления бага
git checkout -b fix/описание-бага
```

### Работа с ветками

```bash
# Посмотреть все ветки
git branch -a

# Переключиться на ветку
git checkout название-ветки

# Создать ветку от текущей
git branch новая-ветка

# Удалить локальную ветку
git branch -d название-ветки
```

### Коммиты

```bash
# Добавить изменения
git add .

# Или конкретные файлы
git add src/components/Component.tsx

# Сделать коммит
git commit -m "feat: описание изменений"

# Типы коммитов:
# feat: новая функциональность
# fix: исправление бага
# docs: изменения в документации
# style: форматирование кода
# refactor: рефакторинг
# test: добавление тестов
# chore: обновление зависимостей и т.п.
```

### Синхронизация с удаленным репозиторием

```bash
# Получить изменения из main
git checkout main
git pull origin main

# Запушить ветку в удаленный репозиторий
git push -u origin название-ветки

# После мерджа в main, обновить локальную ветку
git checkout feature/название
git merge main
```

### Мердж веток

```bash
# Переключиться на main
git checkout main

# Обновить main
git pull origin main

# Влить изменения из ветки
git merge feature/название-фичи

# Запушить в main
git push origin main

# Удалить ветку после мерджа
git branch -d feature/название-фичи
git push origin --delete feature/название-фичи
```

## Примеры веток

- `feature/cloud-animation` - работа над анимацией облака
- `feature/voice-integration` - интеграция голосового ввода
- `fix/typography-sizes` - исправление размеров шрифтов
- `refactor/layout-system` - рефакторинг системы layout

## Полезные команды

```bash
# Посмотреть статус
git status

# Посмотреть историю коммитов
git log --oneline --graph -10

# Посмотреть изменения в файле
git diff файл.tsx

# Отменить изменения в файле (до git add)
git checkout -- файл.tsx

# Отменить git add (но сохранить изменения)
git reset HEAD файл.tsx

# Создать тег для версии
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

