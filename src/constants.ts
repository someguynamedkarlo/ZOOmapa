
export const DEFAULT_ZOOM = 14;
export const MIN_ZOOM = 11;
export const MAX_ZOOM = 20;
export const MAX_TILE_ZOOM = 17; // Max zoom for requesting new tiles. All zooms greater that this will look more and more blurry

export const LAT_CLICK_GROUP_THRESHOLD = 0.00001;
export const LONG_CLICK_GROUP_THRESHOLD = 0.00001;

// TODO: set to false
export const DEBUG: boolean = true;
export function debugConsoleLog(s: string) {
    if (DEBUG) console.log(s);
}
export function debugConsoleLogStringify(s: string, object: any) {
    if (DEBUG) console.log(s, JSON.stringify(object));
}

