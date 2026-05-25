#!/usr/bin/env bash
# use-node.sh — переключение Node.js через .nvmrc на Windows

# Определяем путь к .nvmrc (можно передать как аргумент)
NVM_RC="${1:-.nvmrc}"

if [ ! -f "$NVM_RC" ]; then
    echo "Файл $NVM_RC не найден"
    exit 1
fi

# Извлекаем версию (первая некомментарная строка, убираем \r и пробелы)
NODE_VERSION=$(grep -v '^#' "$NVM_RC" | head -1 | tr -d '\r' | xargs)

if [ -z "$NODE_VERSION" ]; then
    echo "Не удалось определить версию из $NVM_RC"
    exit 1
fi

echo "Требуется Node.js версии: $NODE_VERSION"

# Проверяем наличие nvm в системе (предполагаем nvm-windows)
if command -v nvm &> /dev/null; then
    # Переключаем версию
    nvm use "$NODE_VERSION" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "Версия $NODE_VERSION не установлена. Устанавливаю..."
        nvm install "$NODE_VERSION"
        nvm use "$NODE_VERSION"
    fi
else
    echo "nvm не найден. Установите nvm-windows (https://github.com/coreybutler/nvm-windows)"
    exit 1
fi

# Проверяем, что версия действительно активна
CURRENT_NODE=$(node -v 2>/dev/null | tr -d 'v')
if [[ "$CURRENT_NODE" == "$NODE_VERSION"* ]]; then
    echo "Теперь используется Node.js $CURRENT_NODE"
else
    echo "Внимание: текущая версия ($CURRENT_NODE) не совпадает с требуемой ($NODE_VERSION)"
fi
