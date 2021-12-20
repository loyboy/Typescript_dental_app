export function checkServer(url) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.open("GET", url + "/_session", true);
        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                resolve(http.status > 199 && http.status < 300);
            }
        };
        try {
            http.send(null);
        }
        catch (exception) {
            return reject(false);
        }
    });
}
//# sourceMappingURL=check-server.js.map