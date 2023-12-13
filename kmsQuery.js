const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' }); // Set your region

const kms = new AWS.KMS();

async function listAllKeys() {
    let allKeys = [];
    let marker;
    do {
        const params = marker ? { Marker: marker } : {};
        const response = await kms.listKeys(params).promise();
        allKeys = allKeys.concat(response.Keys);
        marker = response.NextMarker;
    } while (marker);

    return allKeys;
}

async function getKeysWithTagAndValue(tagKey, tagValue) {
    let keyIdsWithTagAndValue = [];
    const keys = await listAllKeys();

    for (let key of keys) {
        const tags = await kms.listResourceTags({ KeyId: key.KeyId }).promise();
        if (tags.Tags.some(tag => tag.TagKey === tagKey && tag.TagValue === tagValue)) {
            keyIdsWithTagAndValue.push(key.KeyId);
        }
    }

    return keyIdsWithTagAndValue;
}

getKeysWithTagAndValue('MY_UNIQUE_TAG', '98aujwd9j').then(keyIds => {
    console.log('Key IDs with MY_UNIQUE_TAG = 98aujwd9j:', keyIds);
}).catch(error => {
    console.error('Error:', error);
});
