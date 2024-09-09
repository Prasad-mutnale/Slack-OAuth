const express = require('express');
const { WebClient } = require('@slack/web-api');
const axios = require('axios');

const app = express();
const port = 3000;

// Replace these with your Slack app credentials
const clientId = '7699652785732.7697443706227';
const clientSecret = '88dfc39f00177bd82302d1003809d6b7';

// OAuth endpoint for Slack

app.get('/', (req, res)=>{
    res.send('<h2>Hello Slack App</h2>')
})

app.get('/slack/oauth', async (req, res) => {
    const { code } = req.query;
    console.log("Code ", code);

    try {
        // Exchange code for access token
        const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
            params: {
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: 'https://sprouts-ai.com/slack/oauth' // Your redirect URI
            }
        });

        console.log("Oauth response===> ", response);

        const { access_token, authed_user } = response.data;

        if (response.data.ok) {
            // You now have the access token and can interact with Slack's API
            const webClient = new WebClient(access_token);
            const result = await webClient.auth.test();
            console.log(result);

            res.send('Slack app connected successfully!');
        } else {
            res.send('Error connecting Slack app.');
        }
    } catch (error) {
        console.error('Error during OAuth:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
