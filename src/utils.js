export function posterFix(url, size = 'FULL') {
    return url.replace('SX300', 'SX' + size);
}

export function validBody(body) {
    throw new Error("Unimplemented feature. (validBody in Utils)");
}