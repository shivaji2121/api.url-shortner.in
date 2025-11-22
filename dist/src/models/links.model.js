"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.links = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.links = (0, pg_core_1.pgTable)('links', {
    id: (0, pg_core_1.serial)().primaryKey(),
    linkCode: (0, pg_core_1.varchar)(),
    targetUrl: (0, pg_core_1.text)('target_url').notNull(),
    totalClicks: (0, pg_core_1.integer)('total_clicks').default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
    lastClickedAt: (0, pg_core_1.timestamp)('last_clicked_at'),
});
