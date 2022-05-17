export function posterFix(url, size = 'FULL') {
    return url.replace('SX300', 'SX' + size);
}