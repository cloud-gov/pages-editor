import siteSelect from './siteSelect';
import removeUser from './removeUser';
import siteWebhook from './siteWebhook';
import publishedBuildStatusWebhook from './publishedBuildStatusWebhook';
import formSchema from './formSchema';
import formSubmit from './formSubmit';

const endpoints = [
    siteSelect, removeUser, siteWebhook, publishedBuildStatusWebhook,
    formSchema, formSubmit,
]

export default endpoints
