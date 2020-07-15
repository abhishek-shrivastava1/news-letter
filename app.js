const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(port, () => console.log(`The server is started on port ${port}`));

app.get('/', (req, res) => res.sendFile(__dirname + "/signup.html"));

app.post('/', (req, res) => {
    console.log("request recieved");
    const obj = req.body;
    var data = {
        members: [{
            email_address: obj.email,
            status: "subscribed",
            merge_fields: {
                FNAME: obj.firstName,
                LNAME: obj.lastName
            }
        }]
    }
    var payload = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/a1a9e3b61f";
    const options = {
        method: "POST",
        auth: "abhishek1:qw2cc62f63c72b4f68436e45027b5e2e3a-us10"
    }
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
            response.on("data", (data) => {
                console.log(JSON.parse(data));
            });
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
    });
    request.write(payload);
    request.end();
});

app.post('/failure', (req, res) => res.sendFile(__dirname + "/signup.html"));