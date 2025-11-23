"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinkSchema = void 0;
exports.validateCreateLink = validateCreateLink;
const valibot_1 = require("valibot");
exports.createLinkSchema = (0, valibot_1.object)({
    targetUrl: (0, valibot_1.string)(),
    customCode: (0, valibot_1.optional)((0, valibot_1.string)()),
});
function validateCreateLink(data) {
    let urlValid = true;
    try {
        new URL(data.targetUrl);
    }
    catch {
        urlValid = false;
    }
    if (!urlValid) {
        return {
            success: false,
            errors: [{ path: 'targetUrl', message: 'Invalid URL format' }],
        };
    }
    if (data.customCode) {
        if (!(typeof data.customCode === 'string' &&
            data.customCode.length >= 6 &&
            data.customCode.length <= 8 &&
            /^[A-Za-z0-9]+$/.test(data.customCode))) {
            return {
                success: false,
                errors: [{ path: 'customCode', message: 'Custom code must be 6-8 alphanumeric characters' }],
            };
        }
    }
    return { success: true, data };
}
;
