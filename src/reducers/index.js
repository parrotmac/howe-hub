import { combineReducers } from 'redux'
import genericLights from './genericLights';
import hueLights from './hueLights';

export default combineReducers({
    genericLights,
    hueLights,
})
