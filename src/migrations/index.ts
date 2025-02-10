import * as migration_20250210_142843 from './20250210_142843';

export const migrations = [
  {
    up: migration_20250210_142843.up,
    down: migration_20250210_142843.down,
    name: '20250210_142843'
  },
];
