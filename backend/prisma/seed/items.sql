COPY public."Ingredient" (id, name, "extraPrice", available, category, "imageUrl", "createdAt") FROM stdin;
1	Bacon	1.00	t	CARNE	\N	2025-10-12 11:27:35.459
2	Jamón cocido	1.00	t	CARNE	\N	2025-10-12 11:27:35.459
3	Ternera picada	1.00	t	CARNE	\N	2025-10-12 11:27:35.459
4	Mozzarela	0.50	t	QUESO	\N	2025-10-12 11:27:35.459
5	Roquefort	1.00	t	QUESO	\N	2025-10-12 11:27:35.459
6	Pimiento verde	0.50	t	VEGETAL	\N	2025-10-12 11:27:35.459
7	Maíz	0.50	t	VEGETAL	\N	2025-10-12 11:27:35.459
8	Pimiento Rojo	0.50	t	VEGETAL	\N	2025-10-12 11:27:35.459
9	Cebolla	0.50	t	VEGETAL	\N	2025-10-12 11:27:35.459
10	Champiñones	0.50	t	VEGETAL	\N	2025-10-12 11:27:35.459
11	Nata	0.50	t	SALSA	\N	2025-10-12 11:27:35.459
12	Tomate	0.50	t	SALSA	\N	2025-10-12 11:27:35.459
13	Aceitunas Negras	0.50	t	VEGETAL	\N	2025-10-12 11:27:35.459
14	Barbacoa	0.50	t	SALSA	\N	2025-10-12 11:36:04.145
\.

COPY public."Product" (id, name, description, category, "basePrice", "imageUrl", active, "createdAt", "updatedAt") FROM stdin;
17c0872f-99fb-45b0-b012-66f48b81876a	Barbacoa	La más pedida del pueblo	PIZZA	8.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:27:43.632
e68dbc10-2c89-4480-898c-694323827d02	Carbonara	Mezcla italiana y española	PIZZA	8.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:28:39.608
f3733f46-38a7-4833-ba0d-57330c547c29	Campesina	La alegría de la huerta	PIZZA	8.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:29:12.04
550de258-e751-4b56-b694-003acd115851	Margarita	Simple y exquisita	PIZZA	7.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:29:24.996
1075c138-2e08-462c-b29f-424b79d2fc3d	4 Quesos	Para los amantes del queso	PIZZA	8.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:29:48.649
252b6e6a-b487-4e9f-af55-7f6fd1230a17	Proscuitto	Rica como ella sola	PIZZA	0.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:30:14.086
0f0f2007-7cca-4bff-a982-122a995cf908	Coca Cola	\N	BEBIDA	2.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:30:29.099
a70514dc-55bc-4c80-9879-243a9c57dcce	Fuze Tea	\N	BEBIDA	2.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:30:44.193
08bf2c5c-6a9f-48b1-9312-f09a90ac0b8f	Aquiarius	\N	BEBIDA	2.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:30:57.206
916ba7cc-1d5b-4b92-9354-6cbbbcd51d6a	Fanta Limón	\N	BEBIDA	2.00	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:31:14.529
8d7eadd0-f524-4cef-9153-120dc20c9e6e	Cerveza Alhambra	\N	BEBIDA	2.50	\N	t	2025-10-12 11:31:53.75	2025-10-12 11:31:25.325
\.

COPY public."ProductVariant" (id, name, "priceDelta", active, "productId") FROM stdin;
b6c9eb34-fb5f-4a46-a585-01846fca6a90	Mediana	0.00	t	17c0872f-99fb-45b0-b012-66f48b81876a
158ad202-436e-4440-a1ef-57fc70ba74e2	Mediana	0.00	t	e68dbc10-2c89-4480-898c-694323827d02
18c01d03-d943-4914-8ee1-9c2d709337c7	Mediana	0.00	t	f3733f46-38a7-4833-ba0d-57330c547c29
22adbac5-690a-424f-86ab-69d090e0f69e	Familiar	5.00	t	17c0872f-99fb-45b0-b012-66f48b81876a
7bcbb6fa-abd8-4c42-a54d-78e959207fce	Familiar	5.00	t	e68dbc10-2c89-4480-898c-694323827d02
ae1b64e5-967a-4236-a214-224e4963f5c5	Familiar	5.00	t	f3733f46-38a7-4833-ba0d-57330c547c29
\.

COPY public."Settings" (id, "openTime", "closeTime", "breakStart", "breakEnd", "deliveryFee", "minOrderAmount", "avgPrepMinutes", "autoAcceptOrders", "temporarilyClosed", "statusMessage", "createdAt", "updatedAt") FROM stdin;
98e959ed-4991-4efd-b685-499e91bb8d30	12:00	23:30	16:30	19:00	3.00	12.00	30	t	f	\N	2025-11-15 07:53:16.666	2025-11-15 07:52:13.47
\.

COPY public."User" (id, email, password, name, surname, phone, role, active, "createdAt", "updatedAt") FROM stdin;
c8f82608-4809-4f33-a0e4-2068e16ceab1	juan@example.com	$2b$10$po/NwFO1dZKrL9GHTkGC5OOC/HboM6qJfzUTBsKDyZBsAKFPpn382	Juan	Pérez	600123456	CUSTOMER	t	2025-10-14 14:20:27.115	2025-10-14 14:20:27.115
f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	gerardoperez@gmail.com	$2b$10$Xa3TsieXuqgT8HypweyMk.RYYZQMOpsjL/43AYL5sZPKh64DptmEm	Gerardo	Pérez	658687234	CUSTOMER	t	2025-10-14 14:22:20.364	2025-10-14 14:22:20.364
fe960ef5-204d-48f0-810d-e3a49149e8af	claudiorivasns@gmail.com	$2b$10$qNl.7wBsrbSQ4FQEN0kSMO92WEWriYFkdTMGsuxvFStKzBW0vQXeW	Claudio	Rivas	658110478	CUSTOMER	t	2025-10-14 15:11:24.136	2025-10-14 15:22:47.971
\.

COPY public."Address" (id, "userId", label, street, city, "postalCode", province, instructions, "isDefault", "createdAt") FROM stdin;
d42080b1-13f1-4107-a837-39ccba9af1dd	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	\N	Calle Río Genil 26	Atarfe	18230	Granada	\N	t	2025-10-21 15:02:31.121
937cefe8-71ac-4c4b-bbfe-d1ecc21ee7c0	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	Mi casa	Calle Isaac Albeniz 7	La Zubia	18140	Granada	\N	f	2025-10-21 15:01:35.45
\.


COPY public."PizzaConfig" (id, "productId", "allowCustomization") FROM stdin;
27e76008-692f-4a0c-919c-abef3f247d46	17c0872f-99fb-45b0-b012-66f48b81876a	t
0b64df67-a47b-4ac0-bc05-b40faac4cdd0	e68dbc10-2c89-4480-898c-694323827d02	t
\.

COPY public."PizzaBaseIngredient" ("pizzaConfigId", "ingredientId") FROM stdin;
27e76008-692f-4a0c-919c-abef3f247d46	14
27e76008-692f-4a0c-919c-abef3f247d46	3
27e76008-692f-4a0c-919c-abef3f247d46	1
27e76008-692f-4a0c-919c-abef3f247d46	9
0b64df67-a47b-4ac0-bc05-b40faac4cdd0	1
0b64df67-a47b-4ac0-bc05-b40faac4cdd0	10
0b64df67-a47b-4ac0-bc05-b40faac4cdd0	11
\.

COPY public."Order" (id, "userId", "isGuest", "customerName", "customerPhone", "deliveryType", "addressId", "deliveryStreet", "deliveryCity", "deliveryPostalCode", "deliveryInstructions", "scheduledFor", "estimatedTime", subtotal, "deliveryFee", total, status, "createdAt", "updatedAt") FROM stdin;
e23a172d-aaa8-4c58-b6bf-9a8c829206e9	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	f	Gerardo Pérez	658687234	PICKUP	\N	\N	\N	\N	\N	\N	2025-11-15 08:23:25.891	36.50	0.00	36.50	CANCELLED	2025-11-15 07:53:25.895	2025-11-15 07:59:07.989
ad60f15b-9bef-4270-9af3-df791cd97052	\N	t	Juan Rodriguez	685971826	PICKUP	\N	\N	\N	\N	\N	\N	2025-11-15 08:37:41.14	18.00	0.00	18.00	PENDING	2025-11-15 08:07:41.145	2025-11-15 08:07:41.145
487ef52f-2035-45aa-b580-0a37291e90f9	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	f	Gerardo Pérez	658687234	DELIVERY	937cefe8-71ac-4c4b-bbfe-d1ecc21ee7c0	Calle Isaac Albeniz 7	La Zubia	18140	\N	\N	2025-11-15 08:41:07.405	8.50	3.00	11.50	PENDING	2025-11-15 08:11:07.408	2025-11-15 08:11:07.408
539c73c0-c1d3-4eec-8b87-2fb3e8f454fa	\N	t	Juan Rodriguez	685971826	DELIVERY	\N	Calle Rio Darro 7	Atarfe	18230	\N	\N	2025-11-15 08:46:02.922	18.00	3.00	21.00	PENDING	2025-11-15 08:16:02.925	2025-11-15 08:16:02.925
356ab97c-81e7-413b-88b6-1c4b3003f039	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	f	Gerardo Pérez	658687234	PICKUP	\N	\N	\N	\N	\N	\N	2025-12-02 15:16:47.726	2.00	0.00	2.00	CANCELLED	2025-12-02 14:46:47.728	2025-12-02 14:47:17.597
db244a6a-6216-4fd2-924a-f4abeef31aec	\N	t	Juan Rodriguez	685971826	PICKUP	\N	\N	\N	\N	\N	\N	2025-12-02 15:17:22.474	18.00	0.00	18.00	PENDING	2025-12-02 14:47:22.476	2025-12-02 14:47:22.476
7029c710-539f-448c-b316-6804b93a7645	\N	t	Juan Rodriguez	685971826	DELIVERY	\N	Calle Rio Darro 7	Atarfe	18230	\N	\N	2025-12-02 15:17:26.659	18.00	3.00	21.00	PENDING	2025-12-02 14:47:26.66	2025-12-02 14:47:26.66
7ccc586f-e72a-462e-939f-9fa7799be606	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	f	Gerardo Pérez	658687234	DELIVERY	937cefe8-71ac-4c4b-bbfe-d1ecc21ee7c0	Calle Isaac Albeniz 7	La Zubia	18140	\N	\N	2025-12-09 11:04:38.354	2.00	3.00	5.00	PAID	2025-12-09 10:34:38.356	2025-12-09 10:40:39.881
8acd4070-0ca2-4e54-b639-885deaf2d546	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	f	Gerardo Pérez	658687234	DELIVERY	937cefe8-71ac-4c4b-bbfe-d1ecc21ee7c0	Calle Isaac Albeniz 7	La Zubia	18140	\N	\N	2025-12-09 12:03:48.136	28.00	3.00	31.00	PAID	2025-12-09 11:33:48.138	2025-12-09 11:35:00.662
95c71135-43ba-4889-8fd9-c9aa7e953636	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	f	Gerardo Pérez	658687234	DELIVERY	937cefe8-71ac-4c4b-bbfe-d1ecc21ee7c0	Calle Isaac Albeniz 7	La Zubia	18140	\N	\N	2025-12-09 12:12:31.656	2.00	3.00	5.00	PAID	2025-12-09 11:42:31.661	2025-12-09 11:45:43.653
78eabc1f-58d3-49f2-920b-ebc9bbd01305	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	f	Gerardo Pérez	658687234	DELIVERY	937cefe8-71ac-4c4b-bbfe-d1ecc21ee7c0	Calle Isaac Albeniz 7	La Zubia	18140	\N	\N	2025-12-09 15:10:42.476	10.50	3.00	13.50	PAID	2025-12-09 14:40:42.478	2025-12-09 14:41:29.93
d3b1f81b-26ef-4f79-9b80-a1f2f79aba65	f9f2fc77-e0b4-4b02-8c9a-81fe9b11b64b	f	Gerardo Pérez	658687234	DELIVERY	937cefe8-71ac-4c4b-bbfe-d1ecc21ee7c0	Calle Isaac Albeniz 7	La Zubia	18140	\N	\N	2025-12-09 17:14:07.196	28.00	3.00	31.00	PAID	2025-12-09 16:44:07.201	2025-12-09 16:48:09.974
\.

COPY public."OrderItem" (id, "orderId", "productId", "variantId", "nameSnapshot", "variantSnapshot", "notesSnapshot", "unitPrice", quantity, subtotal) FROM stdin;
045d478b-dc90-4d94-9d4e-5543d97b2283	e23a172d-aaa8-4c58-b6bf-9a8c829206e9	e68dbc10-2c89-4480-898c-694323827d02	158ad202-436e-4440-a1ef-57fc70ba74e2	Carbonara	Mediana	\N	8.50	1	8.50
abbc4057-1ce2-4c63-b110-8caeef5eb36c	e23a172d-aaa8-4c58-b6bf-9a8c829206e9	17c0872f-99fb-45b0-b012-66f48b81876a	22adbac5-690a-424f-86ab-69d090e0f69e	Barbacoa	Familiar	\N	13.00	2	26.00
680aec16-8cfb-4c36-a0e1-5661a352a3d9	e23a172d-aaa8-4c58-b6bf-9a8c829206e9	08bf2c5c-6a9f-48b1-9312-f09a90ac0b8f	\N	Aquiarius	\N	\N	2.00	1	2.00
a39270b1-ba02-4f22-8985-9affc38c8944	ad60f15b-9bef-4270-9af3-df791cd97052	17c0872f-99fb-45b0-b012-66f48b81876a	b6c9eb34-fb5f-4a46-a585-01846fca6a90	Barbacoa	Mediana	\N	9.00	2	18.00
0434ba4f-a03e-4250-abaf-3d71cdddfcd2	487ef52f-2035-45aa-b580-0a37291e90f9	e68dbc10-2c89-4480-898c-694323827d02	158ad202-436e-4440-a1ef-57fc70ba74e2	Carbonara	Mediana	\N	8.50	1	8.50
52838d00-0e7c-4cc5-81f3-3734196339d0	539c73c0-c1d3-4eec-8b87-2fb3e8f454fa	17c0872f-99fb-45b0-b012-66f48b81876a	b6c9eb34-fb5f-4a46-a585-01846fca6a90	Barbacoa	Mediana	\N	9.00	2	18.00
3dc662b1-bcf8-4c64-9191-0704bf5d2fff	356ab97c-81e7-413b-88b6-1c4b3003f039	08bf2c5c-6a9f-48b1-9312-f09a90ac0b8f	\N	Aquiarius	\N	\N	2.00	1	2.00
df1ece63-f237-41e4-b648-62d624bfa6a8	db244a6a-6216-4fd2-924a-f4abeef31aec	17c0872f-99fb-45b0-b012-66f48b81876a	b6c9eb34-fb5f-4a46-a585-01846fca6a90	Barbacoa	Mediana	\N	9.00	2	18.00
1c701ad5-2772-4226-8299-ed80088589dd	7029c710-539f-448c-b316-6804b93a7645	17c0872f-99fb-45b0-b012-66f48b81876a	b6c9eb34-fb5f-4a46-a585-01846fca6a90	Barbacoa	Mediana	\N	9.00	2	18.00
ebf2caa6-deb9-47cf-97eb-a6e262477d7b	7ccc586f-e72a-462e-939f-9fa7799be606	08bf2c5c-6a9f-48b1-9312-f09a90ac0b8f	\N	Aquiarius	\N	\N	2.00	1	2.00
b8b043bf-b0cb-43db-9739-476d35c9654f	8acd4070-0ca2-4e54-b639-885deaf2d546	17c0872f-99fb-45b0-b012-66f48b81876a	22adbac5-690a-424f-86ab-69d090e0f69e	Barbacoa	Familiar	\N	13.00	2	26.00
9233898e-4c84-4701-8525-6b0eac940a9a	8acd4070-0ca2-4e54-b639-885deaf2d546	08bf2c5c-6a9f-48b1-9312-f09a90ac0b8f	\N	Aquiarius	\N	\N	2.00	1	2.00
822168dd-2f4e-4a68-b1f2-8a1c75cba556	95c71135-43ba-4889-8fd9-c9aa7e953636	08bf2c5c-6a9f-48b1-9312-f09a90ac0b8f	\N	Aquiarius	\N	\N	2.00	1	2.00
fa5b0ca2-914a-4bfb-9da3-8881bb2fc921	78eabc1f-58d3-49f2-920b-ebc9bbd01305	e68dbc10-2c89-4480-898c-694323827d02	158ad202-436e-4440-a1ef-57fc70ba74e2	Carbonara	Mediana	\N	8.50	1	8.50
72023681-e684-4055-9d13-65c544487a55	78eabc1f-58d3-49f2-920b-ebc9bbd01305	08bf2c5c-6a9f-48b1-9312-f09a90ac0b8f	\N	Aquiarius	\N	\N	2.00	1	2.00
39661f62-5a2f-46dc-a0f9-99cfa6dd9d1f	d3b1f81b-26ef-4f79-9b80-a1f2f79aba65	17c0872f-99fb-45b0-b012-66f48b81876a	22adbac5-690a-424f-86ab-69d090e0f69e	Barbacoa	Familiar	\N	13.00	2	26.00
40f81031-bd2c-4e15-8eb5-47621b29add2	d3b1f81b-26ef-4f79-9b80-a1f2f79aba65	08bf2c5c-6a9f-48b1-9312-f09a90ac0b8f	\N	Aquiarius	\N	\N	2.00	1	2.00
\.

COPY public."OrderItemIngredient" ("orderItemId", "ingredientId", action, "priceSnapshot") FROM stdin;
045d478b-dc90-4d94-9d4e-5543d97b2283	7	ADD	0.50
045d478b-dc90-4d94-9d4e-5543d97b2283	1	REMOVE	1.00
a39270b1-ba02-4f22-8985-9affc38c8944	5	ADD	1.00
0434ba4f-a03e-4250-abaf-3d71cdddfcd2	7	ADD	0.50
0434ba4f-a03e-4250-abaf-3d71cdddfcd2	1	REMOVE	1.00
52838d00-0e7c-4cc5-81f3-3734196339d0	5	ADD	1.00
df1ece63-f237-41e4-b648-62d624bfa6a8	5	ADD	1.00
1c701ad5-2772-4226-8299-ed80088589dd	5	ADD	1.00
fa5b0ca2-914a-4bfb-9da3-8881bb2fc921	7	ADD	0.50
fa5b0ca2-914a-4bfb-9da3-8881bb2fc921	1	REMOVE	1.00
\.

COPY public."Payment" (id, "orderId", provider, "providerPaymentId", amount, currency, status, "createdAt", "updatedAt") FROM stdin;
d8a7ad44-8381-4e0c-ad1f-1b58792e9cb1	e23a172d-aaa8-4c58-b6bf-9a8c829206e9	CASH_ON_DELIVERY	\N	36.5	EUR	PENDING	2025-11-15 07:53:25.925	2025-11-15 07:53:25.925
c02e3174-25f2-439b-a30f-25dcd280efb8	ad60f15b-9bef-4270-9af3-df791cd97052	STRIPE	\N	18	EUR	PENDING	2025-11-15 08:07:41.162	2025-11-15 08:07:41.162
a3d306a3-20b0-46a3-b921-ded33140cdff	487ef52f-2035-45aa-b580-0a37291e90f9	CASH_ON_DELIVERY	\N	11.5	EUR	PENDING	2025-11-15 08:11:07.425	2025-11-15 08:11:07.425
58017866-0433-4b6b-8ade-0d71b91b2a32	539c73c0-c1d3-4eec-8b87-2fb3e8f454fa	STRIPE	\N	21	EUR	PENDING	2025-11-15 08:16:02.943	2025-11-15 08:16:02.943
b6441377-d72f-4754-b352-e1af64aefbcb	356ab97c-81e7-413b-88b6-1c4b3003f039	CASH_ON_DELIVERY	\N	2	EUR	PENDING	2025-12-02 14:46:47.737	2025-12-02 14:46:47.737
67ef3ea0-09c8-4b48-af68-86ce90e36814	db244a6a-6216-4fd2-924a-f4abeef31aec	STRIPE	\N	18	EUR	PENDING	2025-12-02 14:47:22.485	2025-12-02 14:47:22.485
8615b3b2-6c5a-4715-901c-3cccb3de7c9d	7029c710-539f-448c-b316-6804b93a7645	STRIPE	\N	21	EUR	PENDING	2025-12-02 14:47:26.666	2025-12-02 14:47:26.666
a7a02f18-8535-44a4-9de2-94d3eab96fbc	7ccc586f-e72a-462e-939f-9fa7799be606	CASH_ON_DELIVERY	pi_3ScOLSCw2160Tpul1PKUxCGn	5	EUR	SUCCEEDED	2025-12-09 10:34:38.366	2025-12-09 10:40:39.881
c92eafff-2453-4a67-9059-d29eb1d5d7f6	8acd4070-0ca2-4e54-b639-885deaf2d546	CASH_ON_DELIVERY	pi_3ScPC3Cw2160Tpul1Bx2cgff	31	EUR	SUCCEEDED	2025-12-09 11:33:48.147	2025-12-09 11:35:00.662
3aad1a61-a8f0-4cee-a553-2b96b6cbd098	95c71135-43ba-4889-8fd9-c9aa7e953636	CASH_ON_DELIVERY	pi_3ScPKsCw2160Tpul1VBEeahZ	5	EUR	SUCCEEDED	2025-12-09 11:42:31.674	2025-12-09 11:45:43.653
1f3cc7ea-4c3f-45d0-8871-9468785fc63c	78eabc1f-58d3-49f2-920b-ebc9bbd01305	STRIPE	pi_3ScS6WCw2160Tpul0ftmF5J0	13.5	EUR	SUCCEEDED	2025-12-09 14:40:42.496	2025-12-09 14:41:29.93
82e65869-4d0c-4b0d-9346-f2151575b1f1	d3b1f81b-26ef-4f79-9b80-a1f2f79aba65	STRIPE	pi_3ScU56Cw2160Tpul095gdLAq	31	EUR	SUCCEEDED	2025-12-09 16:44:07.212	2025-12-09 16:48:09.974
\.