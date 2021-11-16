const https = require("https")
// switch to axios later
// const axios = require("axios")

class Webhook {
    constructor (url_str) {
        const url = new URL(url_str)
        this.postOptions = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': 0,
            }
        }
        // this.postRequest = https.request(this.postOptions)
    }

    message(message) {
        send(JSON.stringify({
            "content": message
        }))
    }
 
    send(data) {
        console.log(typeof(data))
        this.postOptions["headers"]['Content-Length'] = data.length
        this.postRequest = https.request(this.postOptions)
        this.postRequest.write(data)
    }
}

module.exports = Webhook