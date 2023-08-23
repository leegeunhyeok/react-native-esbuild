"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisify = void 0;
const promisify = (task) => {
    return new Promise((resolve, reject) => {
        task((maybeError, result) => {
            if (maybeError) {
                reject(maybeError);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.promisify = promisify;
//# sourceMappingURL=index.js.map