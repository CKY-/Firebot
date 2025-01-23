module.exports = {
    openapi: "3.0.0",
    info: {
        title: "Firebot API Documentation",
        version: "1.0.0",
        description: `<div align="center"><img
    src="https://raw.githubusercontent.com/crowbartools/Firebot/refs/heads/master/src/gui/images/logo.png"
    alt=""></div>\n\n [Firebot](http://firebot.app) hosts a local API that developers can use to get data from Firebot or tell it to run effects.
- The API is hosted on port 7472. All endpoints have the root http://localhost:7472/api/v1
All responses are in JSON.
- Don't forget that Firebot must be running for the API to be available.`,
        license: {
            name: "GPL 3.0",
            url: "https://github.com/crowbartools/Firebot?tab=GPL-3.0-1-ov-file#readme"
        }
    },
    servers: [
        {
            url: "http://localhost:7472/api/v1"
        }
    ]
};

//swagger-jsdoc -d api-router-def.cjs src/server/api/v1/v1-router.ts -o open-api.json