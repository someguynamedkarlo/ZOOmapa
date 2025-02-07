
export const DEFAULT_ZOOM = 14;
export const MIN_ZOOM = 11;
export const MAX_ZOOM = 19;
export const MAX_TILE_ZOOM = 17; // Max zoom for requesting new tiles. All zooms greater that this will look more and more blurry

export const LAT_CLICK_GROUP_THRESHOLD = 0.00003;
export const LONG_CLICK_GROUP_THRESHOLD = 0.00003;

// TODO: set to false
export const DEBUG: boolean = false;
export function debugConsoleLog(s: string) {
    if (DEBUG) console.log(s);
}
export function debugConsoleLogStringify(s: string, object: any) {
    if (DEBUG) console.log(s, JSON.stringify(object));
}

