-- Mock data

insert into Buyer (email, username, password) values
    ('foo@foo.com', 'foo', 'hunter2'),
    ('bar@bar.com', 'bar', 'hunter3');

insert into Vendor (email, username, password) values
    ('vendor@vendor.com', 'vendor', 'hunter2');

insert into Listing (vendor_id, name, price, description) values
    (1, 'PlayStation 5', 549.99, 'Sony PlayStation 5'),
    (1, 'Diapers Size 2, 186 Count', 18.99,
        'Diapers Size 2, 186 Count - Pampers Swaddlers Disposable Baby Diapers, ONE MONTH SUPPLY (Packaging May Vary)'),
    (1, '2021 Apple MacBook Proß', 849.99,
        '2021 Apple MacBook Pro (14-inch, Apple M1 Pro chip with 8‑core CPU and 14‑core GPU, 16GB RAM, 512GB SSD) - Space Gray'),
    (1, 'Oculus Quest 2', 299.99,
        'Diapers Size 2, 186 Count - Pampers Swaddlers Disposable Baby Diapers, ONE MONTH SUPPLY (Packaging May Vary)'),
    (1, 'Kindle', 29.99,
        'Kindle - With a Built-in Front Light - Black - Ad-Supported'),
    (1, 'Echo Dot', 129.99,
        'Echo Dot (4th Gen, 2020 release) | Smart speaker with Alexa | Charcoal'),
    (1, 'Yugioh Frog The Jam Japanese Ultra Rare No Ref 1999.', 52.17, 'Condition: Used: An item that has been used previously. See the seller’s listing for full details and description of any imperfections.'),
    (1, 'Ecolution Pure Intentions, 8-Quart, Stainless Steel ', 37.33, 'This stockpot is perfect for tackling large meals and so much more!');

insert into ListingImages (listing_id, url) values
    (1, 'https://www.nme.com/wp-content/uploads/2020/06/ps5-credit-sie@2000x1270.jpg'),
    (2, 'https://m.media-amazon.com/images/I/81p83lbc4ML._AC_SX679_.jpg'),
    (3, 'https://m.media-amazon.com/images/I/61vFO3R5UNL._AC_SX679_.jpg'),
    (4, 'https://m.media-amazon.com/images/I/615YaAiA-ML._SX522_.jpg'),
    (5, 'https://m.media-amazon.com/images/I/61LKmORUuXL._AC_SX679_.jpg'),
    (6, 'https://m.media-amazon.com/images/I/81Eqgg0cvrL._AC_SX679_.jpg'),
    (7, 'https://i.ebayimg.com/images/g/QIMAAOSwIttiOyuQ/s-l1600.jpg'),
    (8, 'https://m.media-amazon.com/images/I/61WufZsG7rL._AC_SL1500_.jpg');

insert into Purchase (buyer_id, listing_id, qty) values
    (1, 1, 1),
    (1, 2, 2),
    (1, 3, 2),
    (1, 4, 1);
