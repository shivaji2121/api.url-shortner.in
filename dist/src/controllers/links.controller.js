"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linkService_1 = require("../services/linkService");
class LinksController {
    constructor() {
        this.createLink = async (req, res) => {
            try {
                const { targetUrl, customCode } = req.body;
                if (!targetUrl) {
                    return res.status(400).json({ error: 'targetUrl is required' });
                }
                const newLink = await (0, linkService_1.createLink)({ targetUrl, customCode }, req.get('host') || '');
                res.status(201).json({ message: 'Link created successfully', data: newLink });
            }
            catch (error) {
                console.error('Error creating link:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
    }
}
exports.default = LinksController;
