import { execSync } from 'node:child_process';
import { existsSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';

const LOCK_FILE = '.docs-gen-lock';

/**
 * Запускает генерацию документации один раз, даже если lint-staged вызывает скрипт для нескольких файлов.
 * Использует файл-блокировку для предотвращения множественных запусков.
 */
const run = () => {
  // Проверяем, не запущена ли уже генерация
  if (existsSync(LOCK_FILE)) {
    const lockTime = parseInt(readFileSync(LOCK_FILE, 'utf8'), 10);
    const now = Date.now();
    // Если блокировка свежая (меньше 5 секунд), пропускаем
    if (now - lockTime < 5000) {
      return;
    }
  }

  // Создаем блокировку
  writeFileSync(LOCK_FILE, Date.now().toString());

  try {
    execSync('npm run docs:gen', { stdio: 'inherit' });
    execSync('git add docs', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to generate docs:', error);
    process.exit(1);
  } finally {
    // Удаляем блокировку после завершения
    if (existsSync(LOCK_FILE)) {
      try {
        unlinkSync(LOCK_FILE);
      } catch {
        // Игнорируем ошибки удаления
      }
    }
  }
};

run();
