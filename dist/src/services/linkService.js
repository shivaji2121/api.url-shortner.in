"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLink = createLink;
exports.getAllLinks = getAllLinks;
exports.getLinksPaginated = getLinksPaginated;
exports.getLinkByCode = getLinkByCode;
exports.redirectAndTrack = redirectAndTrack;
exports.urlExists = urlExists;
exports.deleteLinkByCode = deleteLinkByCode;
const dbConfig_1 = require("../config/dbConfig");
const links_model_1 = require("../models/links.model");
const drizzle_orm_1 = require("drizzle-orm");
async function createLink(params, baseUrl) {
    const { targetUrl, customCode } = params;
    const code = customCode || generateCode();
    const existingLink = await dbConfig_1.db.select().from(links_model_1.links).where((0, drizzle_orm_1.eq)(links_model_1.links.linkCode, code)).limit(1);
    if (existingLink.length > 0) {
        throw new Error('link already exists');
    }
    const now = new Date();
    const newLink = {
        targetUrl,
        linkCode: code,
        totalClicks: 0,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        lastClickedAt: null,
    };
    await dbConfig_1.db.insert(links_model_1.links).values(newLink);
    const insertedLinks = await dbConfig_1.db.select().from(links_model_1.links).where((0, drizzle_orm_1.eq)(links_model_1.links.linkCode, code)).limit(1);
    if (insertedLinks.length === 0) {
        throw new Error('Error retrieving inserted link');
    }
    const insertedLink = insertedLinks[0];
    return {
        ...insertedLink,
        linkCode: insertedLink.linkCode ?? null,
        totalClicks: insertedLink.totalClicks !== undefined && insertedLink.totalClicks !== null ? insertedLink.totalClicks : 0,
        createdAt: insertedLink.createdAt,
        updatedAt: insertedLink.updatedAt,
        deletedAt: insertedLink.deletedAt ?? null,
        lastClickedAt: insertedLink.lastClickedAt ?? null,
    };
}
async function getAllLinks(baseUrl) {
    const allLinks = await dbConfig_1.db.select().from(links_model_1.links).where((0, drizzle_orm_1.isNull)(links_model_1.links.deletedAt));
    return allLinks.map(link => ({
        ...link,
        linkCode: link.linkCode ?? null,
        totalClicks: link.totalClicks !== undefined && link.totalClicks !== null ? link.totalClicks : 0,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        deletedAt: link.deletedAt ?? null,
        lastClickedAt: link.lastClickedAt ?? null,
    }));
}
async function getLinksPaginated(page, pageSize, searchCode) {
    const offset = (page - 1) * pageSize;
    const condition = searchCode ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(links_model_1.links.deletedAt), (0, drizzle_orm_1.eq)(links_model_1.links.linkCode, searchCode)) : (0, drizzle_orm_1.isNull)(links_model_1.links.deletedAt);
    const [linksResult, totalResult] = await Promise.all([
        dbConfig_1.db.select()
            .from(links_model_1.links)
            .where(condition)
            .limit(pageSize)
            .offset(offset),
        dbConfig_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(links_model_1.links)
            .where(condition)
    ]);
    const total = Number(totalResult[0]?.count) || 0;
    const data = linksResult.map((link) => ({
        ...link,
        linkCode: link.linkCode ?? null,
        totalClicks: link.totalClicks ?? 0,
        deletedAt: link.deletedAt ?? null,
        lastClickedAt: link.lastClickedAt ?? null,
    }));
    return {
        data,
        total,
        page,
        pageSize,
    };
}
async function getLinkByCode(code) {
    const [link] = await dbConfig_1.db
        .select()
        .from(links_model_1.links)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(links_model_1.links.linkCode, code), (0, drizzle_orm_1.isNull)(links_model_1.links.deletedAt)))
        .limit(1);
    return link || null;
}
async function redirectAndTrack(code) {
    const link = await dbConfig_1.db.select().from(links_model_1.links).where((0, drizzle_orm_1.eq)(links_model_1.links.linkCode, code)).limit(1);
    if (link.length === 0 || link[0].deletedAt !== null) {
        throw new Error('Link not found or deleted');
    }
    const targetUrl = link[0].targetUrl;
    await dbConfig_1.db.update(links_model_1.links)
        .set({
        totalClicks: link[0].totalClicks + 1,
        lastClickedAt: new Date(),
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(links_model_1.links.linkCode, code));
    return targetUrl;
}
async function urlExists(targetUrl) {
    const result = await dbConfig_1.db.select().from(links_model_1.links).where((0, drizzle_orm_1.eq)(links_model_1.links.targetUrl, targetUrl));
    return result.length > 0;
}
async function deleteLinkByCode(code) {
    const result = await dbConfig_1.db
        .update(links_model_1.links)
        .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(links_model_1.links.linkCode, code), (0, drizzle_orm_1.isNull)(links_model_1.links.deletedAt)))
        .returning();
    return result.length > 0;
}
function generateCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
