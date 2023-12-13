const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' }); // Setting the region to eu-west-2

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

async function getKeysWithTagValue(tagKey, tagValue) {
    let keyIdsWithTagValue = [];
    const keys = await listAllKeys();

    for (let key of keys) {
        const tags = await kms.listResourceTags({ KeyId: key.KeyId }).promise();
        if (tags.Tags.some(tag => tag.TagKey === tagKey && tag.TagValue === tagValue)) {
            keyIdsWithTagValue.push(key.KeyId);
        }
    }

    return keyIdsWithTagValue;
}

getKeysWithTagValue('KEY_OWNER', 'CRAIG').then(keyIds => {
    console.log('Key IDs with KEY_OWNER = CRAIG:', keyIds);
}).catch(error => {
    console.error('Error:', error);
});
