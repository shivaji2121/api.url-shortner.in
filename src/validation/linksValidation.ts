import { object, optional, string } from 'valibot';

export const createLinkSchema = object({
    targetUrl: string(),
    customCode: optional(string()),
});

export function validateCreateLink(data: any) {
    let urlValid = true;
    try {
        new URL(data.targetUrl);
    } catch {
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
};
