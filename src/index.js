import mqtt from 'mqtt';
import { createStore } from 'redux';
import rootReducer from './reducers';
import { toggleHueLight } from './actions';
import { reverse, startsWith, values } from 'lodash';
import HueHub from './cores/hue/hueHub';
import { HUE_SWITCH_BUTTONS, HUE_SWITCH_BUTTON_STATES } from './cores/hue';
import { zip, timer, from } from 'rxjs';

const MQTT_HOST = process.env.MQTT_HOST || 'mqtt://localhost';
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const HUE_HUB_IP = process.env.HUE_HUB_IP;
const HUE_HUB_AUTH_TOKEN = process.env.HUE_HUB_AUTH_TOKEN;

const mqttClient = mqtt.connect(`${MQTT_HOST}:${MQTT_PORT}`);

const hueAPIClient = new HueHub(HUE_HUB_IP, HUE_HUB_AUTH_TOKEN);

const reduxStore = createStore(rootReducer);

const TOPICS = {
    SUB: {
        HUE_SWITCH: 'd/remote/hue/+', // .../<switch ID>/<button ID>/<state ID>
        COMPUSTAR_REMOTE: 'd/remote/compustar/+', // .../<remote ID>
        GENERIC_REMOTE: 'd/remote/generic/+', // .../<remote ID>/<command>
        DOOR_LOCK: 'd/lock/event/+', // .../<lock ID>
        DOOR_SENSOR: 'd/door-sensor/+', // .../<sensor ID>
        TEMP_SENSOR: 'd/temp-sensor/+', // .../<sensor ID>
    },
    PUB: {
        HUE_LIGHT: 'd/light/hue/+', // .../<light ID>d/remote/hue/+/+/+
        HUE_LIGHT_GROUP: 'd/light-group/hub/+', // .../<group ID>
        GENERIC_LIGHT_GROUP: 'd/light-group/generic/+', // .../<group ID>
        GENERIC_LIGHT: 'd/light/generic/+', // .../<light ID>
        DOOR_LOCK: 'd/lock/set/+', // .../<lock ID>
    }
}

const bathroomLightIds = [4, 2, 1];

const HUE_SWITCH_HANDLERS = {
    BEDROOM: {

    },
    MAIN_ROOM: {

    },
    BATHROOM: {
        'TOP_ON': {
            'UP_SHORT': () => {
                zip(from(bathroomLightIds), timer(0, 300))
                    .subscribe((data, i) => {
                        const lightId = data[0];
                        reduxStore.dispatch(
                            toggleHueLight(lightId, 20)
                        )
                    })
            }
        },
        'BTM_OFF': {
            'UP_SHORT': () => {
                zip(from(reverse(bathroomLightIds)), timer(0, 300))
                    .subscribe((data, i) => {
                        const lightId = data[0];
                        reduxStore.dispatch(
                            toggleHueLight(lightId, 0)
                        )
                    })
            }
        }
    }
};

const processHueButtonPress = message => {
    try {
        const buttonKey = HUE_SWITCH_BUTTONS[message.button_id];
        const stateKey = HUE_SWITCH_BUTTON_STATES[message.state_id];

        console.log("Hue Button Press", message.switch_id, buttonKey, stateKey);

        switch (`${message.switch_id}`) {
            case "1": // bedroom switch
                HUE_SWITCH_HANDLERS.BEDROOM[buttonKey][stateKey]();
                break;
            case "2": // main room switch
                HUE_SWITCH_HANDLERS.MAIN_ROOM[buttonKey][stateKey]();
                break;
            case "3": // bathroom switch
                HUE_SWITCH_HANDLERS.BATHROOM[buttonKey][stateKey]();
                break;
        }
    } catch (e) {
        console.error(e);
    }
};

const processCompustarButtonPress = message => {

}

let oldestKnownCommandTimestamp = 0;

reduxStore.subscribe(() => {
    const state = reduxStore.getState();
    console.log("subscribed state", state);

    const lightList = values(state.hueLights.lights);

    lightList.forEach(light => {
        const { id, brightness, timestamp } = light;
        if(timestamp > oldestKnownCommandTimestamp) {
            hueAPIClient.setLightBrightnessPercent(id, brightness);
            oldestKnownCommandTimestamp = timestamp;
        }
    })

})

mqttClient.subscribe(TOPICS.SUB.HUE_SWITCH);
mqttClient.on('message', (topic, message) => {
    const jsonMessage = JSON.parse(message);

    if (startsWith(topic, 'd/remote/hue/')) {
        processHueButtonPress(jsonMessage);
    }

    if (startsWith(topic, 'd/remote/compustar/')) {
        processCompustarButtonPress(jsonMessage);
    }

    // console.log(topic, JSON.stringify(jsonMessage));
    // reduxStore.dispatch(toggleLightGeneric('123', true, Date.now()))
});
