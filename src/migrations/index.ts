import * as migration_20250210_142843 from './20250210_142843';
import * as migration_20250402_154919_users from './20250402_154919_users';
import * as migration_20250414_163653 from './20250414_163653';
import * as migration_20250415_155040 from './20250415_155040';
import * as migration_20250418_162118 from './20250418_162118';
import * as migration_20250418_180302 from './20250418_180302';

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
    name: '20250414_163653',
  },
  {
    up: migration_20250415_155040.up,
    down: migration_20250415_155040.down,
    name: '20250415_155040',
  },
  {
    up: migration_20250418_162118.up,
    down: migration_20250418_162118.down,
    name: '20250418_162118',
  },
  {
    up: migration_20250418_180302.up,
    down: migration_20250418_180302.down,
    name: '20250418_180302'
  },
];
