import siteSelect from './siteSelect';
import removeUser from './removeUser';
import siteWebhook from './siteWebhook';
import publishedBuildStatusWebhook from './publishedBuildStatusWebhook';

const endpoints = [
    siteSelect, removeUser, siteWebhook, publishedBuildStatusWebhook,
]

export default endpoints
