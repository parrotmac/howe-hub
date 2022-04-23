export const ACTION_TYPES = {
    LIGHT: {
        GENERIC_TOGGLE: "ACTION_LIGHT_GENERIC_TOGGLE",
        GENERIC_GROUP_TOGGLE: "ACTION_LIGHT_GROUP_GENERIC_TOGGLE",
        HUE_TOGGLE: "ACTION_LIGHT_HUE_TOGGLE",
        HUE_GROUP_TOGGLE: "ACTION_LIGHT_HUE_GROUP_TOGGLE",
    }
}

export const toggleLightGeneric = (lightId, on) => ({
    type: ACTION_TYPES.LIGHT.GENERIC_TOGGLE,
    lightId: lightId,
    brightness: on ? 100 : 0,
    timestamp: Date.now()
})

export const toggleHueLight = (lightId, brightness) => {
    console.log('ADDING DISPATCH:', lightId);
    return {
        type: ACTION_TYPES.LIGHT.HUE_TOGGLE,
        lightId,
        brightness,
        timestamp: Date.now()
    };
}
