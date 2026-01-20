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
import * as migration_20250611_211537_simplify_policies_collection from './20250611_211537_simplify_policies_collection';
import * as migration_20250827_214629_add_menu_config_and_standardize_collection_fields from './20250827_214629_add_menu_config_and_standardize_collection_fields';
import * as migration_20250828_175542_set_payload_v350 from './20250828_175542_set_payload_v350';
import * as migration_20250829_161933_add_leadership_collection from './20250829_161933_add_leadership_collection';
import * as migration_20250903_222602_adjust_menu_site_global from './20250903_222602_adjust_menu_site_global';
import * as migration_20250904_150654_add_menu_dropdown_label from './20250904_150654_add_menu_dropdown_label';
import * as migration_20250911_145416_updated_global_site_config_for_branding from './20250911_145416_updated_global_site_config_for_branding';
import * as migration_20250926_185337_add_resources_collection from './20250926_185337_add_resources_collection';
import * as migration_20251007_193343_update_events_collection from './20251007_193343_update_events_collection';
import * as migration_20251009_185422_remove_auto_image_sizing from './20251009_185422_remove_auto_image_sizing';
import * as migration_20251010_190304_change_subtitle_and_label_from_pages from './20251010_190304_change_subtitle_and_label_from_pages';
import * as migration_20251015_160106_add_search_config from './20251015_160106_add_search_config';
import * as migration_20251020_174213_add_home_page from './20251020_174213_add_home_page';
import * as migration_20251021_194515_add_dap_agency_code_config from './20251021_194515_add_dap_agency_code_config';
import * as migration_20251022_183554_add_prefooter_site_global from './20251022_183554_add_prefooter_site_global';
import * as migration_20251022_203703_add_site_slug from './20251022_203703_add_site_slug';
import * as migration_20251031_034159_add_side_navigation_and_page_menus from './20251031_034159_add_side_navigation_and_page_menus';
import * as migration_20251106_155545_in_page_nav from './20251106_155545_in_page_nav';
import * as migration_20251106_202836_add_alerts_collection from './20251106_202836_add_alerts_collection';
import * as migration_20251107_212634_update_alerts_collection from './20251107_212634_update_alerts_collection';
import * as migration_20251112_141751_add_review_ready_global_collections from './20251112_141751_add_review_ready_global_collections';
import * as migration_20251112_200436_update_alert_collection_title_and_review_ready from './20251112_200436_update_alert_collection_title_and_review_ready';
import * as migration_20251120_165949_add_footer_site_global from './20251120_165949_add_footer_site_global';
import * as migration_20251120_212009_add_collection_updated_by from './20251120_212009_add_collection_updated_by';
import * as migration_20251125_162928_add_custom_collection from './20251125_162928_add_custom_collection';
import * as migration_20251128_152929_update_alert_collection_aligment from './20251128_152929_update_alert_collection_aligment';
import * as migration_20251201_173417_rename_side_navigation from './20251201_173417_rename_side_navigation';
import * as migration_20251204_202526_update_payload_3_66_0 from './20251204_202526_update_payload_3_66_0';
import * as migration_20251215_214228_add_not_found_page from './20251215_214228_add_not_found_page';
import * as migration_20251215_225725_add_related_items_field from './20251215_225725_add_related_items_field';
import * as migration_20251222_172007_update_slug_lock_default_to_false from './20251222_172007_update_slug_lock_default_to_false';
import * as migration_20260113_165126_add_bg_image_homepage_text_block from './20260113_165126_add_bg_image_homepage_text_block';

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
    name: '20250604_221543_add_policies_collection',
  },
  {
    up: migration_20250611_211537_simplify_policies_collection.up,
    down: migration_20250611_211537_simplify_policies_collection.down,
    name: '20250611_211537_simplify_policies_collection',
  },
  {
    up: migration_20250827_214629_add_menu_config_and_standardize_collection_fields.up,
    down: migration_20250827_214629_add_menu_config_and_standardize_collection_fields.down,
    name: '20250827_214629_add_menu_config_and_standardize_collection_fields',
  },
  {
    up: migration_20250828_175542_set_payload_v350.up,
    down: migration_20250828_175542_set_payload_v350.down,
    name: '20250828_175542_set_payload_v350',
  },
  {
    up: migration_20250829_161933_add_leadership_collection.up,
    down: migration_20250829_161933_add_leadership_collection.down,
    name: '20250829_161933_add_leadership_collection',
  },
  {
    up: migration_20250903_222602_adjust_menu_site_global.up,
    down: migration_20250903_222602_adjust_menu_site_global.down,
    name: '20250903_222602_adjust_menu_site_global',
  },
  {
    up: migration_20250904_150654_add_menu_dropdown_label.up,
    down: migration_20250904_150654_add_menu_dropdown_label.down,
    name: '20250904_150654_add_menu_dropdown_label',
  },
  {
    up: migration_20250911_145416_updated_global_site_config_for_branding.up,
    down: migration_20250911_145416_updated_global_site_config_for_branding.down,
    name: '20250911_145416_updated_global_site_config_for_branding',
  },
  {
    up: migration_20250926_185337_add_resources_collection.up,
    down: migration_20250926_185337_add_resources_collection.down,
    name: '20250926_185337_add_resources_collection',
  },
  {
    up: migration_20251007_193343_update_events_collection.up,
    down: migration_20251007_193343_update_events_collection.down,
    name: '20251007_193343_update_events_collection',
  },
  {
    up: migration_20251009_185422_remove_auto_image_sizing.up,
    down: migration_20251009_185422_remove_auto_image_sizing.down,
    name: '20251009_185422_remove_auto_image_sizing',
  },
  {
    up: migration_20251010_190304_change_subtitle_and_label_from_pages.up,
    down: migration_20251010_190304_change_subtitle_and_label_from_pages.down,
    name: '20251010_190304_change_subtitle_and_label_from_pages',
  },
  {
    up: migration_20251015_160106_add_search_config.up,
    down: migration_20251015_160106_add_search_config.down,
    name: '20251015_160106_add_search_config',
  },
  {
    up: migration_20251020_174213_add_home_page.up,
    down: migration_20251020_174213_add_home_page.down,
    name: '20251020_174213_add_home_page',
  },
  {
    up: migration_20251021_194515_add_dap_agency_code_config.up,
    down: migration_20251021_194515_add_dap_agency_code_config.down,
    name: '20251021_194515_add_dap_agency_code_config',
  },
  {
    up: migration_20251022_183554_add_prefooter_site_global.up,
    down: migration_20251022_183554_add_prefooter_site_global.down,
    name: '20251022_183554_add_prefooter_site_global',
  },
  {
    up: migration_20251022_203703_add_site_slug.up,
    down: migration_20251022_203703_add_site_slug.down,
    name: '20251022_203703_add_site_slug',
  },
  {
    up: migration_20251031_034159_add_side_navigation_and_page_menus.up,
    down: migration_20251031_034159_add_side_navigation_and_page_menus.down,
    name: '20251031_034159_add_side_navigation_and_page_menus',
  },
  {
    up: migration_20251106_155545_in_page_nav.up,
    down: migration_20251106_155545_in_page_nav.down,
    name: '20251106_155545_in_page_nav',
  },
  {
    up: migration_20251106_202836_add_alerts_collection.up,
    down: migration_20251106_202836_add_alerts_collection.down,
    name: '20251106_202836_add_alerts_collection',
  },
  {
    up: migration_20251107_212634_update_alerts_collection.up,
    down: migration_20251107_212634_update_alerts_collection.down,
    name: '20251107_212634_update_alerts_collection',
  },
  {
    up: migration_20251112_141751_add_review_ready_global_collections.up,
    down: migration_20251112_141751_add_review_ready_global_collections.down,
    name: '20251112_141751_add_review_ready_global_collections',
  },
  {
    up: migration_20251112_200436_update_alert_collection_title_and_review_ready.up,
    down: migration_20251112_200436_update_alert_collection_title_and_review_ready.down,
    name: '20251112_200436_update_alert_collection_title_and_review_ready',
  },
  {
    up: migration_20251120_165949_add_footer_site_global.up,
    down: migration_20251120_165949_add_footer_site_global.down,
    name: '20251120_165949_add_footer_site_global',
  },
  {
    up: migration_20251120_212009_add_collection_updated_by.up,
    down: migration_20251120_212009_add_collection_updated_by.down,
    name: '20251120_212009_add_collection_updated_by',
  },
  {
    up: migration_20251125_162928_add_custom_collection.up,
    down: migration_20251125_162928_add_custom_collection.down,
    name: '20251125_162928_add_custom_collection',
  },
  {
    up: migration_20251128_152929_update_alert_collection_aligment.up,
    down: migration_20251128_152929_update_alert_collection_aligment.down,
    name: '20251128_152929_update_alert_collection_aligment',
  },
  {
    up: migration_20251201_173417_rename_side_navigation.up,
    down: migration_20251201_173417_rename_side_navigation.down,
    name: '20251201_173417_rename_side_navigation',
  },
  {
    up: migration_20251204_202526_update_payload_3_66_0.up,
    down: migration_20251204_202526_update_payload_3_66_0.down,
    name: '20251204_202526_update_payload_3_66_0',
  },
  {
    up: migration_20251215_214228_add_not_found_page.up,
    down: migration_20251215_214228_add_not_found_page.down,
    name: '20251215_214228_add_not_found_page',
  },
  {
    up: migration_20251215_225725_add_related_items_field.up,
    down: migration_20251215_225725_add_related_items_field.down,
    name: '20251215_225725_add_related_items_field',
  },
  {
    up: migration_20251222_172007_update_slug_lock_default_to_false.up,
    down: migration_20251222_172007_update_slug_lock_default_to_false.down,
    name: '20251222_172007_update_slug_lock_default_to_false',
  },
  {
    up: migration_20260113_165126_add_bg_image_homepage_text_block.up,
    down: migration_20260113_165126_add_bg_image_homepage_text_block.down,
    name: '20260113_165126_add_bg_image_homepage_text_block'
  },
];
