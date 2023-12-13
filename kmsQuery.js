const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' }); // Set your region

const kms = new AWS.KMS();

async function getKeysWithTag(tagKey) {
    let keysWithTag = [];

    // List all keys
    const keys = await kms.listKeys().promise();

    for (let key of keys.Keys) {
        // For each key, list its tags
        const tags = await kms.listResourceTags({ KeyId: key.KeyId }).promise();

        // Check if the key has the specified tag
        if (tags.Tags.some(tag => tag.TagKey === tagKey)) {
            keysWithTag.push(key);
        }
    }

    return keysWithTag;
}

getKeysWithTag('MY_UNIQUE_TAG').then(keys => {
    console.log('Keys with MY_UNIQUE_TAG:', keys);
}).catch(error => {
    console.error('Error:', error);
});
