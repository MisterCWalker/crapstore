const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' }); // Set your region

const kms = new AWS.KMS();

async function getKeysWithTagAndValue(tagKey, tagValue) {
    let keysWithTagAndValue = [];

    // List all keys
    const keys = await kms.listKeys().promise();

    for (let key of keys.Keys) {
        // For each key, list its tags
        const tags = await kms.listResourceTags({ KeyId: key.KeyId }).promise();

        // Check if the key has the specified tag with the specified value
        if (tags.Tags.some(tag => tag.TagKey === tagKey && tag.TagValue === tagValue)) {
            keysWithTagAndValue.push(key);
        }
    }

    return keysWithTagAndValue;
}

getKeysWithTagAndValue('MY_UNIQUE_TAG', '98aujwd9j').then(keys => {
    console.log('Keys with MY_UNIQUE_TAG = 98aujwd9j:', keys);
}).catch(error => {
    console.error('Error:', error);
});
