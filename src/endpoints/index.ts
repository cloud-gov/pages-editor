import siteSelect from './siteSelect';
import removeUser from './removeUser';
import siteWebhook from './siteWebhook';
import publishedBuildStatusWebhook from './publishedBuildStatusWebhook';
import formSchema from './formSchema';
import formSubmit from './formSubmit';
import { isFormsEnabled } from '@/utilities/featureFlags';

const endpoints = [
    siteSelect, removeUser, siteWebhook, publishedBuildStatusWebhook,
    // Forms endpoints are only registered when the Forms feature is enabled
    ...(isFormsEnabled() ? [formSchema, formSubmit] : []),
]

export default endpoints
