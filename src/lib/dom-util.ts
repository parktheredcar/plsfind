const KEYCODE_CONSTANTS = {
    ENTER: 'Enter',
    NUMPAD_ENTER: 'NumpadEnter',
    BACKSPACE: 'Backspace',
    DELETE: 'Delete'
}

const enterCodes = [KEYCODE_CONSTANTS.ENTER, KEYCODE_CONSTANTS.NUMPAD_ENTER];
const wasEnterPressed = function (keyCode: string): boolean {
    return wasKeyPressed(keyCode, enterCodes);
}

const deleteCodes = [KEYCODE_CONSTANTS.DELETE, KEYCODE_CONSTANTS.BACKSPACE]
const wasBackspaceOrDeletePressed = function (keyCode: string): boolean {
return wasKeyPressed(keyCode, deleteCodes);
}

const wasKeyPressed = function(code: string, matches: string[]): boolean {
    return matches.indexOf(code) >= 0
}


export {
    wasEnterPressed,
    wasBackspaceOrDeletePressed,
    KEYCODE_CONSTANTS
}