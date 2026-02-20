BEGIN;

-- ===============================
-- INSERT CUSTOMIZABLE INGREDIENTS
-- ===============================
INSERT INTO "Customizable"(name, "extraPrice", category) VALUES
('Mozzarella', 1.00, 'QUESO'),
('Mozzarella búfala', 1.50, 'QUESO'),
('Parmesano', 1.20, 'QUESO'),
('Gorgonzola', 1.30, 'QUESO'),
('Emmental', 1.10, 'QUESO'),
('Burrata', 2.00, 'QUESO'),
('Jamón cocido', 1.50, 'CARNE'),
('Jamón de Parma', 2.50, 'CARNE'),
('Salami picante', 1.80, 'CARNE'),
('Guanciale', 2.00, 'CARNE'),
('Chorizo picante', 1.80, 'CARNE'),
('Salmón ahumado', 2.80, 'CARNE'),
('Anchoas', 1.70, 'CARNE'),
('Mortadella', 1.80, 'CARNE'),
('Bacon', 1.80, 'CARNE'),
('Pollo', 1.90, 'CARNE'),
('Atún', 1.70, 'CARNE'),
('Champiñones', 1.20, 'VEGETAL'),
('Rúcula', 1.00, 'VEGETAL'),
('Cebolla', 0.80, 'VEGETAL'),
('Cebolla caramelizada', 1.20, 'VEGETAL'),
('Pimiento asado', 1.20, 'VEGETAL'),
('Aceitunas negras', 1.00, 'VEGETAL'),
('Tomate cherry', 1.10, 'VEGETAL'),
('Albahaca', 0.80, 'VEGETAL'),
('Alcaparras', 1.00, 'VEGETAL'),
('Maíz', 0.90, 'VEGETAL'),
('Jalapeños', 1.00, 'VEGETAL'),
('Tomate', 0.50, 'SALSA'),
('Nata', 0.70, 'SALSA'),
('Crema de trufa', 1.50, 'SALSA'),
('Aceite picante', 0.60, 'SALSA'),
('Huevo', 1.30, 'EXTRA'),
('Pistacho', 1.50, 'EXTRA'),
('Ralladura de limón', 0.70, 'EXTRA');

-- ===============================
-- INSERT PRODUCTS
-- ===============================
INSERT INTO "Product"(id, name, description, category, subcategory, "basePrice", "allowCustomization", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'Margherita Classica', 'Tomate, mozzarella y albahaca fresca', 'PIZZA', 'TRADIZIONALI', 8.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Prosciutto e Funghi', 'Jamón cocido y champiñones', 'PIZZA', 'TRADIZIONALI', 8.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Quattro Formaggi', 'Mezcla de cuatro quesos italianos', 'PIZZA', 'TRADIZIONALI', 8.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Diavola', 'Salami picante italiano', 'PIZZA', 'TRADIZIONALI', 8.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Tartufo Nero', 'Crema de trufa negra y parmesano', 'PIZZA', 'GOURMET', 10.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Parma & Rúcula', 'Jamón de Parma, rúcula y parmesano', 'PIZZA', 'GOURMET', 10.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Salmone Deluxe', 'Salmón ahumado y alcaparras', 'PIZZA', 'GOURMET', 10.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Mortadella & Pistacho', 'Mortadella italiana, burrata y pistacho', 'PIZZA', 'GOURMET', 10.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Bella Massa Special', 'Guanciale, cebolla caramelizada y crema parmesano', 'PIZZA', 'ESPECIALES', 11.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Inferno Mediterráneo', 'Chorizo picante, pimientos y aceitunas', 'PIZZA', 'ESPECIALES', 11.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Carbonara Romana', 'Guanciale, huevo y parmesano', 'PIZZA', 'ESPECIALES', 11.00, true, NOW(), NOW()),
(gen_random_uuid(), 'Cinque Terre', 'Tomate cherry, anchoas y ralladura de limón', 'PIZZA', 'ESPECIALES', 11.00, true, NOW(), NOW());

-- ===============================
-- INSERT VARIANTS
-- ===============================
INSERT INTO "ProductVariant"(id, name, "priceDelta", "productId")
SELECT gen_random_uuid(), 'Mediana', 0.00, id FROM "Product"
UNION ALL
SELECT gen_random_uuid(), 'Familiar', 6.00, id FROM "Product";

-- ===============================
-- ALLOW ALL CUSTOMIZABLES FOR ALL PIZZAS
-- ===============================
INSERT INTO "ProductAvailableCustomizable"("productId", "customizableId")
SELECT p.id, c.id
FROM "Product" p
CROSS JOIN "Customizable" c;

-- ===============================
-- BASE INGREDIENTS PER PIZZA
-- ===============================

-- MARGHERITA
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Margherita Classica'
AND c.name IN ('Tomate', 'Mozzarella', 'Albahaca');

-- PROSCIUTTO E FUNGHI
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Prosciutto e Funghi'
AND c.name IN ('Tomate', 'Mozzarella', 'Jamón cocido', 'Champiñones');

-- QUATTRO FORMAGGI
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Quattro Formaggi'
AND c.name IN ('Mozzarella', 'Gorgonzola', 'Parmesano', 'Emmental', 'Nata');

-- DIAVOLA
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Diavola'
AND c.name IN ('Tomate', 'Mozzarella', 'Salami picante', 'Aceite picante');

-- TARTUFO NERO
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Tartufo Nero'
AND c.name IN ('Mozzarella', 'Crema de trufa', 'Champiñones', 'Parmesano');

-- PARMA & RÚCULA
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Parma & Rúcula'
AND c.name IN ('Tomate', 'Mozzarella búfala', 'Jamón de Parma', 'Rúcula', 'Parmesano');

-- SALMONE DELUXE
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Salmone Deluxe'
AND c.name IN ('Nata', 'Mozzarella', 'Salmón ahumado', 'Alcaparras');

-- MORTADELLA & PISTACHO
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Mortadella & Pistacho'
AND c.name IN ('Mozzarella', 'Mortadella', 'Burrata', 'Pistacho');

-- BELLA MASSA SPECIAL
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Bella Massa Special'
AND c.name IN ('Tomate', 'Mozzarella', 'Guanciale', 'Cebolla caramelizada', 'Parmesano');

-- INFERNO MEDITERRÁNEO
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Inferno Mediterráneo'
AND c.name IN ('Tomate', 'Mozzarella', 'Chorizo picante', 'Pimiento asado', 'Aceitunas negras', 'Aceite picante');

-- CARBONARA ROMANA
-- Nota: 'Pimienta' eliminada, no existe en Customizable
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Carbonara Romana'
AND c.name IN ('Nata', 'Mozzarella', 'Guanciale', 'Huevo', 'Parmesano');

-- CINQUE TERRE
INSERT INTO "ProductBaseCustomizable"("productId", "customizableId")
SELECT p.id, c.id FROM "Product" p, "Customizable" c
WHERE p.name = 'Cinque Terre'
AND c.name IN ('Tomate cherry', 'Mozzarella búfala', 'Anchoas', 'Aceitunas negras', 'Albahaca', 'Ralladura de limón');

COMMIT;