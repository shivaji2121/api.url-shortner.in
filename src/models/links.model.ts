import { integer, serial, pgTable, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
    id: serial().primaryKey(),
    linkCode: varchar(),
    targetUrl: text('target_url').notNull(),
    totalClicks: integer('total_clicks').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    deletedAt: timestamp('deleted_at'),
    lastClickedAt: timestamp('last_clicked_at'),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
