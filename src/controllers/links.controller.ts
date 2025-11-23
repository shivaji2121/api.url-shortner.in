import { Request, Response } from 'express';
import { createLink, getLinksPaginated, redirectAndTrack } from '../services/linkService';
import { validateCreateLink } from '../validation/linksValidation';
import { getPaginationMeta } from '../utils/helper';

class LinksController {
    createLink = async (req: Request, res: Response) => {
        try {
            const validationResult = validateCreateLink(req.body);

            if (!validationResult.success) {
                return res.status(400).json({ errors: validationResult.errors });
            }

            const { targetUrl, customCode } = validationResult.data;

            const protocol = req.protocol || 'http';
            const host = req.get('host');
            const baseUrl = host ? `${protocol}://${host}` : process.env.BASE_URL || '';

            const newLink = await createLink(
                { targetUrl, customCode },
                baseUrl
            );

            // Add shortUrl to response
            const response = {
                ...newLink,
                shortUrl: `${baseUrl}/${newLink.linkCode}`
            };

            return res.status(201).json({
                message: 'Link created successfully',
                data: response
            });

        } catch (error: any) {
            console.error('Error creating link:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    redirect = async (req: Request, res: Response) => {
        try {
            const code = req.params.code;
            const targetUrl = await redirectAndTrack(code);
            return res.redirect(targetUrl);
        } catch (error: any) {
            console.error('Error redirecting link:', error);
            return res.status(404).json({ error: 'Link not found or deleted' });
        }
    }

    getAllLinksPaginated = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const searchCode = req.query.searchCode as string | undefined;


            if (page < 1 || pageSize < 1 || pageSize > 100) {
                return res.status(400).json({ message: 'Invalid pagination parameters' });
            }

            const paginatedData = await getLinksPaginated(page, pageSize, searchCode);
            const paginationMeta = getPaginationMeta(page, pageSize, paginatedData.total);

            return res.status(200).json({
                message: 'Links retrieved successfully',
                paginated_info: paginationMeta,
                data: paginatedData.data,
            });
        } catch (error: any) {
            console.error('Error retrieving paginated links:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };

}

export default LinksController;
