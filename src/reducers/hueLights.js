import { ACTION_TYPES } from '../actions';

const initialState = {
    lights: {},
    groups: {}
}

const hueLights = (state=initialState, action) => {
    switch(action.type) {
        case(ACTION_TYPES.LIGHT.HUE_TOGGLE):
            const {lightId, brightness, timestamp} = action;
            const newState = {...state};
            newState.lights[lightId] = {
                id: lightId,
                brightness,
                timestamp
            }
            return newState;
        case(ACTION_TYPES.LIGHT.HUE_GROUP_TOGGLE):
            return state;
        default:
            return state;
    }
};

export default hueLights;
