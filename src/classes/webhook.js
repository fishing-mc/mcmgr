const axios = require("axios")

class Webhook {
    constructor (url) {
        this.url = url;
    }

    send(data) {
        if (typeof(data) === "object") data = JSON.stringify(data)
        axios.post(this.url, data, { headers: {'Content-Type': 'application/json' } });
    }

    message(message) {
        this.send({content: message})
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