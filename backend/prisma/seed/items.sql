-- Limpiar horarios existentes para evitar duplicados
DELETE FROM "BusinessHours";

-- Insertar horarios Lunes a Jueves
INSERT INTO "BusinessHours" ("id", "dayOfWeek", "openTime", "closeTime", "isClosed", "order", "createdAt", "updatedAt")
VALUES 
(gen_random_uuid(), 'MONDAY', '13:00', '16:00', false, 1, NOW(), NOW()),
(gen_random_uuid(), 'MONDAY', '19:30', '23:00', false, 2, NOW(), NOW()),
(gen_random_uuid(), 'TUESDAY', '13:00', '16:00', false, 1, NOW(), NOW()),
(gen_random_uuid(), 'TUESDAY', '19:30', '23:00', false, 2, NOW(), NOW()),
(gen_random_uuid(), 'WEDNESDAY', '13:00', '16:00', false, 1, NOW(), NOW()),
(gen_random_uuid(), 'WEDNESDAY', '19:30', '23:00', false, 2, NOW(), NOW()),
(gen_random_uuid(), 'THURSDAY', '13:00', '16:00', false, 1, NOW(), NOW()),
(gen_random_uuid(), 'THURSDAY', '19:30', '23:00', false, 2, NOW(), NOW());

-- Insertar horarios Viernes a Domingo
INSERT INTO "BusinessHours" ("id", "dayOfWeek", "openTime", "closeTime", "isClosed", "order", "createdAt", "updatedAt")
VALUES 
(gen_random_uuid(), 'FRIDAY', '13:00', '16:30', false, 1, NOW(), NOW()),
(gen_random_uuid(), 'FRIDAY', '19:30', '23:59', false, 2, NOW(), NOW()),
(gen_random_uuid(), 'SATURDAY', '13:00', '16:30', false, 1, NOW(), NOW()),
(gen_random_uuid(), 'SATURDAY', '19:30', '23:59', false, 2, NOW(), NOW()),
(gen_random_uuid(), 'SUNDAY', '13:00', '16:30', false, 1, NOW(), NOW()),
(gen_random_uuid(), 'SUNDAY', '19:30', '23:59', false, 2, NOW(), NOW());

-- 1. LIMPIEZA DE DATOS (Orden inverso a las relaciones)
DELETE FROM "ProductAvailableCustomizable";
DELETE FROM "ProductBaseCustomizable";
DELETE FROM "ProductVariant";
DELETE FROM "Product";
DELETE FROM "Customizable";

-- 2. CUSTOMIZABLES (Ingredientes/Extras)
-- Guardamos IDs fijos (1, 2, 3...) porque son autoincrementales
INSERT INTO "Customizable" ("id", "name", "extraPrice", "available", "category", "createdAt")
VALUES 
(1, 'Mozzarella Extra', 1.50, true, 'QUESO', NOW()),
(2, 'Bacon Crujiente', 1.20, true, 'CARNE', NOW()),
(3, 'Champiñones', 0.80, true, 'VEGETAL', NOW()),
(4, 'Cebolla Caramelizada', 1.00, true, 'VEGETAL', NOW()),
(5, 'Salsa Barbacoa', 0.50, true, 'SALSA', NOW()),
(6, 'Huevo Frito', 1.50, true, 'EXTRA', NOW()),
(7, 'Peperoni', 1.30, true, 'CARNE', NOW());

-- 3. PRODUCTOS
-- Definimos variables para los IDs de productos para usarlos luego en las relaciones
DO $$
DECLARE
    pizza_bbq_id UUID := gen_random_uuid();
    burger_cheese_id UUID := gen_random_uuid();
    coca_cola_id UUID := gen_random_uuid();
BEGIN

    -- Insertar Productos
    INSERT INTO "Product" ("id", "name", "description", "category", "basePrice", "allowCustomization", "active", "createdAt", "updatedAt")
    VALUES 
    (pizza_bbq_id, 'Pizza BBQ', 'Salsa barbacoa, carne picada y bacon', 'PIZZA', 12.90, true, true, NOW(), NOW()),
    (burger_cheese_id, 'Cheeseburger XL', 'Doble carne con queso cheddar', 'BURGER', 8.50, true, true, NOW(), NOW()),
    (coca_cola_id, 'Coca Cola', 'Refresco 33cl', 'BEBIDA', 2.00, false, true, NOW(), NOW());

    -- 4. VARIANTES DE PRODUCTO
    INSERT INTO "ProductVariant" ("id", "name", "priceDelta", "productId", "active")
    VALUES 
    (gen_random_uuid(), 'Mediana', 0.00, pizza_bbq_id, true),
    (gen_random_uuid(), 'Familiar', 5.50, pizza_bbq_id, true),
    (gen_random_uuid(), 'Simple', 0.00, burger_cheese_id, true),
    (gen_random_uuid(), 'Doble Carne', 3.00, burger_cheese_id, true);

    -- 5. PERSONALIZACIÓN BASE (Lo que ya trae el producto)
    -- Pizza BBQ trae Bacon (2) y Mozzarella (1) por defecto
    INSERT INTO "ProductBaseCustomizable" ("productId", "customizableId", "isRemovable")
    VALUES 
    (pizza_bbq_id, 2, true), 
    (pizza_bbq_id, 1, false); -- La mozzarella no se puede quitar

    -- 6. PERSONALIZACIÓN DISPONIBLE (Extras que puedes añadir)
    -- A la Burger se le puede añadir Huevo (6) y Cebolla (4)
    INSERT INTO "ProductAvailableCustomizable" ("productId", "customizableId")
    VALUES 
    (burger_cheese_id, 6),
    (burger_cheese_id, 4),
    (pizza_bbq_id, 7); -- A la pizza se le puede añadir Peperoni extra

END $$;
