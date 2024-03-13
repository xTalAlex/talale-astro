import { defineDb, defineTable, column, NOW } from "astro:db";

const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    netlify_id: column.text({ optional: true }),
    name: column.text(),
    email: column.text(),
    streak_record: column.number({ optional: true, default: 0 }),
    cur_streak: column.number({ optional: true, default: 0 }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
  },
});
