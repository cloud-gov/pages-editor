import * as migration_20250210_142843 from './20250210_142843';
import * as migration_20250402_154919_users from './20250402_154919_users';
import * as migration_20250414_163653 from './20250414_163653';

export const migrations = [
  {
    up: migration_20250210_142843.up,
    down: migration_20250210_142843.down,
    name: '20250210_142843',
  },
  {
    up: migration_20250402_154919_users.up,
    down: migration_20250402_154919_users.down,
    name: '20250402_154919_users',
  },
  {
    up: migration_20250414_163653.up,
    down: migration_20250414_163653.down,
    name: '20250414_163653'
  },
];
