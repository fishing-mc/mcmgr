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
        if (typeof(data) === "object") data = JSON.stringify(data)
        this.postOptions["headers"]['Content-Length'] = data.length
        this.postRequest = https.request(this.postOptions)
        this.postRequest.write(data)
    }
    
    /**
     * @param template  a template of json to send ex. { "content": "<title>" } 
     * @param subs      a object containing keys to perform substitutions on given temple
     *                  if given template { "content": "<title>" }, to replace title with Hello
     *                  give subs { title: "Hello" }
     */
    sendFormatted(template, subs) {
        let formatted = JSON.stringify(template)
        for (const property in subs) {
            let regex = RegExp(`<${property}>`, "g")
            if (typeof(subs[property]) === "number") {
                regex = RegExp(`"<${property}>"`, "g")
            }
            formatted = formatted.replace(regex, subs[property])
        }
        let today = new Date()
        formatted = formatted.replace(/<timestamp>/g, today.toISOString())
        this.send(formatted)
    }
}

module.exports = Webhook