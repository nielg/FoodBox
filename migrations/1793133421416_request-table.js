/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql`
        CREATE TABLE stockbox.requests (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
            stock_item_id INTEGER NOT NULL REFERENCES stockbox.stock_items(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        ALTER TABLE stockbox.requests
        ADD CONSTRAINT unique_user_item_request
        UNIQUE (user_id, stock_item_id);

        CREATE TRIGGER update_request_updated_at
        BEFORE UPDATE ON stockbox.requests
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    `;
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql`
        DROP TRIGGER IF EXISTS update_request_updated_at ON stockbox.requests;
        DROP TABLE IF EXISTS stockbox.requests CASCADE;
    `;
};
