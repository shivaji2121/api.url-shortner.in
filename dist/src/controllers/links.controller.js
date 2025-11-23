"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linkService_1 = require("../services/linkService");
const helper_1 = require("../utils/helper");
const linksValidation_1 = require("../validation/linksValidation");
class LinksController {
    constructor() {
        this.createLink = async (req, res) => {
            try {
                const validationResult = (0, linksValidation_1.validateCreateLink)(req.body);
                if (!validationResult.success) {
                    return res.status(400).json({ errors: validationResult.errors });
                }
                const { targetUrl, customCode } = validationResult.data;
                const existingLink = await (0, linkService_1.urlExists)(targetUrl);
                if (existingLink) {
                    return res.status(409).json({ message: 'Url already exists' });
                }
                const protocol = req.protocol || 'http';
                const host = req.get('host');
                const baseUrl = host ? `${protocol}://${host}` : process.env.BASE_URL || '';
                const newLink = await (0, linkService_1.createLink)({ targetUrl, customCode }, baseUrl);
                const response = {
                    ...newLink,
                    shortUrl: `${baseUrl}/${newLink.linkCode}`
                };
                return res.status(201).json({
                    message: 'Link created successfully',
                    data: response
                });
            }
            catch (error) {
                console.error('Error creating link:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.redirect = async (req, res) => {
            try {
                const code = req.params.code;
                const targetUrl = await (0, linkService_1.redirectAndTrack)(code);
                return res.redirect(targetUrl);
            }
            catch (error) {
                console.error('Error redirecting link:', error);
                return res.status(404).json({ error: 'Link not found or deleted' });
            }
        };
        this.getAllLinksPaginated = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const searchCode = req.query.searchCode;
                if (page < 1 || pageSize < 1 || pageSize > 100) {
                    return res.status(400).json({ message: 'Invalid pagination parameters' });
                }
                const paginatedData = await (0, linkService_1.getLinksPaginated)(page, pageSize, searchCode);
                const paginationMeta = (0, helper_1.getPaginationMeta)(page, pageSize, paginatedData.total);
                return res.status(200).json({
                    message: 'Links retrieved successfully',
                    paginated_info: paginationMeta,
                    data: paginatedData.data,
                });
            }
            catch (error) {
                console.error('Error retrieving paginated links:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.getLinksStats = async (req, res) => {
            try {
                const { code } = req.params;
                const link = await (0, linkService_1.getLinkByCode)(code);
                if (!link) {
                    return res.status(404).json({ error: "Link not found" });
                }
                return res.status(200).json({ message: "Link stats retrieved successfully", ata: link, });
            }
            catch (error) {
                console.error('error: ', error);
            }
        };
        this.deleteLink = async (req, res) => {
            try {
                const { code } = req.params;
                const codeRegex = /^[A-Za-z0-9]{6,8}$/;
                if (!codeRegex.test(code)) {
                    return res.status(404).json({ error: "Invalid code format" });
                }
                const link = await (0, linkService_1.getLinkByCode)(code);
                if (!link) {
                    return res.status(404).json({ error: "Link not found" });
                }
                await (0, linkService_1.deleteLinkByCode)(code);
                return res.status(200).json({ message: "Link deleted successfully" });
            }
            catch (error) {
                console.error('error: ', error);
                return res.status(500).json({ error: "Internal server error" });
            }
        };
    }
}
exports.default = LinksController;
