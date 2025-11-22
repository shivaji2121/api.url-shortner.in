import { db } from '../config/dbConfig';
import { links, NewLink, Link } from '../models/links.model';
import { eq, isNull } from 'drizzle-orm';

interface CreateLinkParams {
    targetUrl: string;
    customCode?: string;
}

export async function linkExists(targetUrl: string): Promise<boolean> {
    const result = await db.select().from(links).where(eq(links.targetUrl, targetUrl));
    return result.length > 0;
}

export async function createLink(params: CreateLinkParams, baseUrl: string): Promise<Link> {
    const { targetUrl, customCode } = params;
    const code = customCode || generateCode();

    const existingLink = await db.select().from(links).where(eq(links.linkCode, code)).limit(1);

    if (existingLink.length > 0) {
        throw new Error('link already exists');
    }

    const now = new Date();

    const newLink: Omit<NewLink, 'id'> = {
        targetUrl,
        linkCode: code,
        totalClicks: 0,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        lastClickedAt: null,
    };

    await db.insert(links).values(newLink);

    const insertedLinks = await db.select().from(links).where(eq(links.linkCode, code)).limit(1);
    if (insertedLinks.length === 0) {
        throw new Error('Error retrieving inserted link');
    }
    const insertedLink = insertedLinks[0];

    return {
        ...insertedLink,
        linkCode: insertedLink.linkCode ?? null,
        totalClicks: insertedLink.totalClicks !== undefined && insertedLink.totalClicks !== null ? insertedLink.totalClicks : 0,
        createdAt: insertedLink.createdAt!,
        updatedAt: insertedLink.updatedAt!,
        deletedAt: insertedLink.deletedAt ?? null,
        lastClickedAt: insertedLink.lastClickedAt ?? null,
    };
}

export async function getAllLinks(baseUrl: string): Promise<Link[]> {
    const allLinks = await db.select().from(links).where(isNull(links.deletedAt));
    return allLinks.map(link => ({
        ...link,
        linkCode: link.linkCode ?? null,
        totalClicks: link.totalClicks !== undefined && link.totalClicks !== null ? link.totalClicks : 0,
        createdAt: link.createdAt!,
        updatedAt: link.updatedAt!,
        deletedAt: link.deletedAt ?? null,
        lastClickedAt: link.lastClickedAt ?? null,
    }));
}

export async function getLinkStats(code: string, baseUrl: string): Promise<Link> {
    const link = await db.select().from(links).where(eq(links.linkCode, code)).limit(1);
    if (link.length === 0) {
        throw new Error('Link not found');
    }
    const singleLink = link[0];
    return {
        ...singleLink,
        linkCode: singleLink.linkCode ?? null,
        totalClicks: singleLink.totalClicks !== undefined && singleLink.totalClicks !== null ? singleLink.totalClicks : 0,
        createdAt: singleLink.createdAt!,
        updatedAt: singleLink.updatedAt!,
        deletedAt: singleLink.deletedAt ?? null,
        lastClickedAt: singleLink.lastClickedAt ?? null,
    };
}

export async function redirectAndTrack(code: string): Promise<string> {
    const link = await db.select().from(links).where(eq(links.linkCode, code)).limit(1);
    if (link.length === 0 || link[0].deletedAt !== null) {
        throw new Error('Link not found or deleted');
    }
    const targetUrl = link[0].targetUrl;

    await db.update(links)
        .set({
            totalClicks: link[0].totalClicks + 1,
            lastClickedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(links.linkCode, code));

    return targetUrl;
}

export async function urlExists(targetUrl: string): Promise<boolean> {
    const result = await db.select().from(links).where(eq(links.targetUrl, targetUrl));
    return result.length > 0;
}

export async function deleteLink(code: string): Promise<void> {
    const link = await db.select().from(links).where(eq(links.linkCode, code)).limit(1);
    if (link.length === 0) {
        throw new Error('Link not found');
    }
    await db.update(links)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(links.linkCode, code));
}

function generateCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


