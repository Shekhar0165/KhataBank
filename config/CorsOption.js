const AllowedOrigan = require("./AllowedOrigin");

class CorsHandler {
    constructor(AllowedOrigan) {
        this.AllowedOrigan = AllowedOrigan;
    }
    CheckOrigin(origin, callback) {
        if (AllowedOrigan.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
    GetCorsOptions() {
        return {
            origin: (origin, callback) => {
                this.CheckOrigin(origin, callback);
            },
            optionsSuccessStatus: 200
        };
    }
}

const Cors = new CorsHandler(AllowedOrigan);
const origin = Cors.GetCorsOptions();

module.exports = origin;