import request from 'request';

class HueHub {
    constructor(host, apiKey) {
        this.host = host;
        this.apiKey = apiKey;
    }

    getURLBase = () => {
        return `http://${this.host}/api/${this.apiKey}`
    }
    
    updateState = (urlSuffix, requestBodyObject) => {
        request.put({
            url: `${this.getURLBase()}${urlSuffix}`,
            json: true,
            body: requestBodyObject
        },function (error, response, body) {
            if(error) {
                console.log('error:', error); // Print the error if one occurred
            }
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.
          });
    };

    setLightBrightnessPercent = (lightId, percent) => {
        const hueBrightness = parseInt(percent * 2.55)
        const huePayload = {"on": (percent !== 0),"transitiontime": 8};
        if(hueBrightness > 0) {
            huePayload.bri = hueBrightness
        }
        // console.log("huePayload", huePayload);
        this.updateState(`/lights/${lightId}/state`, huePayload)
    }
}

export default HueHub;
