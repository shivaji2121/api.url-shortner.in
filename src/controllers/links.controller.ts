import { Request, Response } from 'express';
import { createLink, redirectAndTrack, urlExists } from '../services/linkService';
import { validateCreateLink } from '../validation/linksValidation';

class LinksController {
    createLink = async (req: Request, res: Response) => {
        try {
            const validationResult = validateCreateLink(req.body);

            if (!validationResult.success) {
                return res.status(400).json({ errors: validationResult.errors });
            }

            const { targetUrl, customCode } = validationResult.data;

            const linkExists = await urlExists(targetUrl);

            if (linkExists) {
                return res.status(409).json({ message: 'URL already exists' });
            }

            const protocol = req.protocol || 'http';
            const host = req.get('host');
            const baseUrl = host ? `${protocol}://${host}` : process.env.BASE_URL || '';

            const newLink = await createLink({ targetUrl, customCode }, baseUrl);

            // shortUrl add to response
            const response = { ...newLink, shortUrl: `${baseUrl}/links/${newLink.linkCode}` };

            return res.status(201).json({ message: 'Link created successfully', data: response });

        } catch (error: any) {
            console.error('Error creating link:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    redirect = async (req: Request, res: Response) => {
        try {
            const code = req.params.code;

            if (!code) {
                return res.status(400).json({ error: 'Code parameter is required' });
            }

            const targetUrl = await redirectAndTrack(code);

            return res.redirect(targetUrl);
        } catch (error: any) {
            console.error('Error redirecting link:', error);
            return res.status(404).json({ error: 'Link not found or deleted' });
        }
    }

    getAllLinksPaginated = async (req: Request, res: Response) => {
        // Implementation for paginated retrieval of links
    }
}

export default LinksController;
