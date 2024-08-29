export function getUrls() {
    let baseUrl = window.location.origin;
    if (baseUrl.includes('localhost') || baseUrl.includes('192.168.')) baseUrl = 'https://fairgame.gwdevices.com';
    const apiBaseUrl = `${baseUrl}/api/v1`;
    return { baseUrl, apiBaseUrl };
}
