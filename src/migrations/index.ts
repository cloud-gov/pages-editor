import * as migration_20250210_142843 from './20250210_142843';
import * as migration_20250402_154919_users from './20250402_154919_users';
import * as migration_20250414_163653 from './20250414_163653';
import * as migration_20250415_155040 from './20250415_155040';
import * as migration_20250418_162118 from './20250418_162118';
import * as migration_20250422_140849 from './20250422_140849';
import * as migration_20250424_195526 from './20250424_195526';
import * as migration_20250430_130756 from './20250430_130756';
import * as migration_20250430_185932 from './20250430_185932';
import * as migration_20250508_172925 from './20250508_172925';
import * as migration_20250520_154731_update_media_for_site from './20250520_154731_update_media_for_site';

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
    up: migration_20250422_140849.up,
    down: migration_20250422_140849.down,
    name: '20250422_140849',
  },
  {
    up: migration_20250424_195526.up,
    down: migration_20250424_195526.down,
    name: '20250424_195526',
  },
  {
    up: migration_20250430_130756.up,
    down: migration_20250430_130756.down,
    name: '20250430_130756',
  },
  {
    up: migration_20250430_185932.up,
    down: migration_20250430_185932.down,
    name: '20250430_185932',
  },
  {
    up: migration_20250508_172925.up,
    down: migration_20250508_172925.down,
    name: '20250508_172925',
  },
  {
    up: migration_20250520_154731_update_media_for_site.up,
    down: migration_20250520_154731_update_media_for_site.down,
    name: '20250520_154731_update_media_for_site'
  },
];
