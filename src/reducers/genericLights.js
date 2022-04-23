import { ACTION_TYPES } from '../actions';

const initialState = {
    lights: {},
    groups: {}
}

const genericLights = (state=initialState, action) => {
    switch(action.type) {
        case(ACTION_TYPES.LIGHT.GENERIC_TOGGLE):
            const {lightId, on, timestamp} = action;
            const newState = {...state};
            newState.lights[lightId] = {
                on,
                timestamp
            }
            return newState;
        case(ACTION_TYPES.LIGHT.GENERIC_GROUP_TOGGLE):
            return state;
        default:
            return state;
    }
};

export default genericLights;
