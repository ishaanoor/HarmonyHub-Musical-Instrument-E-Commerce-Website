DROP TABLE IF EXISTS skus CASCADE;
DROP TABLE IF EXISTS variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    active_status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    option_name VARCHAR(50) NOT NULL,
    option_value VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skus (
    id SERIAL PRIMARY KEY,
    variant_id INT REFERENCES variants(id) ON DELETE CASCADE,
    sku_code VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0.00),
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    active_status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data: 2 category levels, 3 products, 4 valid SKUs
INSERT INTO categories (name, slug, parent_id) VALUES ('Guitars', 'guitars', NULL);
INSERT INTO categories (name, slug, parent_id) VALUES ('Electric Guitars', 'electric-guitars', 1);

INSERT INTO products (category_id, name, slug, description, status) VALUES 
(2, 'Fender Stratocaster Player', 'fender-strat-player', 'Classic tone and articulation.', 'published'),
(2, 'Gibson Les Paul Standard', 'gibson-les-paul-std', 'Rich tone and sustain.', 'published'),
(1, 'Yamaha F310 Acoustic', 'yamaha-f310-acoustic', 'Perfect entry-level acoustic.', 'draft');

INSERT INTO variants (product_id, option_name, option_value) VALUES 
(1, 'Color', '3-Color Sunburst'),
(1, 'Color', 'Polar White'),
(2, 'Top Finish', 'Heritage Cherry Sunburst');

INSERT INTO skus (variant_id, sku_code, price, stock_quantity) VALUES 
(1, 'FEN-STRAT-SB', 849.99, 5),
(2, 'FEN-STRAT-PW', 829.50, 3),
(3, 'GIB-LP-HCS', 2499.00, 2),
(1, 'FEN-STRAT-OUT', 849.99, 0);
