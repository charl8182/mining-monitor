'use strict';

exports.handler = (event, context, callback) => {
    const request = require('request');
    const slackUrl = process.env.slackUrl;
    const notifyConnects = process.env.notifyConnects === 'true';
    const notifyDisconnects = process.env.notifyDisconnects === 'true';
    const eventValue = JSON.parse(event.Records[0].Sns.Message);
    const callbackFunction = function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('Slack notification successful. Connection value: ' + eventValue);
            callback(null, 'Done');
        } else if (error) {
            console.error(error);
            callback(error);
        }
    };

    if (notifyConnects && eventValue) {
        request(
            {
                method: 'POST',
                uri: slackUrl,
                body: JSON.stringify({'text': 'The mine has connected to the VPN'})
            }, callbackFunction
        );

        return;
    }

    if (notifyDisconnects && !eventValue) {
        request(
            {
                method: 'POST',
                uri: slackUrl,
                body: JSON.stringify({'text': 'The mine has disconnected from the VPN'})
            }, callbackFunction
        );
    }
};
