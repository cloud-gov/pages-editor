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
import * as migration_20250521_235313_add_reports_collection from './20250521_235313_add_reports_collection';
import * as migration_20250522_195910_adjust_reports_scheme from './20250522_195910_adjust_reports_scheme';
import * as migration_20250527_200531_add_single_pages_collection from './20250527_200531_add_single_pages_collection';
import * as migration_20250603_184955_change_single_pages_collection_to_pages from './20250603_184955_change_single_pages_collection_to_pages';
import * as migration_20250604_221543_add_policies_collection from './20250604_221543_add_policies_collection';

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
    name: '20250520_154731_update_media_for_site',
  },
  {
    up: migration_20250521_235313_add_reports_collection.up,
    down: migration_20250521_235313_add_reports_collection.down,
    name: '20250521_235313_add_reports_collection',
  },
  {
    up: migration_20250522_195910_adjust_reports_scheme.up,
    down: migration_20250522_195910_adjust_reports_scheme.down,
    name: '20250522_195910_adjust_reports_scheme',
  },
  {
    up: migration_20250527_200531_add_single_pages_collection.up,
    down: migration_20250527_200531_add_single_pages_collection.down,
    name: '20250527_200531_add_single_pages_collection',
  },
  {
    up: migration_20250603_184955_change_single_pages_collection_to_pages.up,
    down: migration_20250603_184955_change_single_pages_collection_to_pages.down,
    name: '20250603_184955_change_single_pages_collection_to_pages',
  },
  {
    up: migration_20250604_221543_add_policies_collection.up,
    down: migration_20250604_221543_add_policies_collection.down,
    name: '20250604_221543_add_policies_collection'
  },
];
