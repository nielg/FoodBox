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
  pgm.sql(`
    -- 1. CREATE STOCK_ITEMS TABLE
    CREATE TABLE stockbox.stock_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      metric VARCHAR(50) NOT NULL,
      public BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. CREATE STOCK_BATCHES TABLE
    CREATE TABLE stockbox.stock_batches (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      stock_item_id INTEGER NOT NULL REFERENCES stockbox.stock_items(id) ON DELETE CASCADE,
      quantity NUMERIC(10, 2) NOT NULL,
      expire_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Add unique contraint
    ALTER TABLE stockbox.stock_batches
    ADD CONSTRAINT unique_user_item_expire_date 
    UNIQUE (user_id, stock_item_id, expire_date);

    -- 3. ATTACH EXISTING TRIGGER FOR UPDATED_AT
    CREATE TRIGGER update_stock_items_updated_at
    BEFORE UPDATE ON stockbox.stock_items
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

    CREATE TRIGGER update_stock_batches_updated_at
    BEFORE UPDATE ON stockbox.stock_batches
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();    
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS stockbox.stock_batches CASCADE;
    DROP TABLE IF EXISTS stockbox.stock_items CASCADE;    
  `);
};
