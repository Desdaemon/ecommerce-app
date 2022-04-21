-- Mock data

insert into Buyer (email, username, password) values
    ('foo@foo.com', 'foo', 'hunter2'),
    ('bar@bar.com', 'bar', 'hunter3');

insert into Vendor (email, username, password) values
    ('vendor@vendor.com', 'vendor', 'hunter2');

insert into Listing (name, price, description) values
    ('PlayStation 5', 549.99, 'Sony PlayStation 5'),
    ('Diapers Size 2, 186 Count', 18.99,
        'Diapers Size 2, 186 Count - Pampers Swaddlers Disposable Baby Diapers, ONE MONTH SUPPLY (Packaging May Vary)'),
    ('2021 Apple MacBook Proß', 849.99,
        '2021 Apple MacBook Pro (14-inch, Apple M1 Pro chip with 8‑core CPU and 14‑core GPU, 16GB RAM, 512GB SSD) - Space Gray'),
    ('Oculus Quest 2', 299.99,
        'Diapers Size 2, 186 Count - Pampers Swaddlers Disposable Baby Diapers, ONE MONTH SUPPLY (Packaging May Vary)'),
    ('Kindle', 29.99,
        'Kindle - With a Built-in Front Light - Black - Ad-Supported'),
    ('Echo Dot', 129.99,
        'Echo Dot (4th Gen, 2020 release) | Smart speaker with Alexa | Charcoal'),
    ('Yugioh Frog The Jam Japanese Ultra Rare No Ref 1999.', 52.17,
        'Condition: Used: An item that has been used previously. See the seller’s listing for full details and description of any imperfections.'),
    ('Ecolution Pure Intentions, 8-Quart, Stainless Steel ', 37.33,
        'This stockpot is perfect for tackling large meals and so much more!');

insert into VendorListings (vendor_id, listing_id) values
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (1, 6),
    (1, 7),
    (1, 8);

insert into ListingImages (listing_id, url) values
    (1, 'https://www.nme.com/wp-content/uploads/2020/06/ps5-credit-sie@2000x1270.jpg'),
    (2, 'https://m.media-amazon.com/images/I/81p83lbc4ML._AC_SX679_.jpg'),
    (3, 'https://m.media-amazon.com/images/I/61vFO3R5UNL._AC_SX679_.jpg'),
    (4, 'https://m.media-amazon.com/images/I/615YaAiA-ML._SX522_.jpg'),
    (5, 'https://m.media-amazon.com/images/I/61LKmORUuXL._AC_SX679_.jpg'),
    (6, 'https://m.media-amazon.com/images/I/81Eqgg0cvrL._AC_SX679_.jpg'),
    (7, 'https://i.ebayimg.com/images/g/QIMAAOSwIttiOyuQ/s-l1600.jpg'),
    (8, 'https://m.media-amazon.com/images/I/61WufZsG7rL._AC_SL1500_.jpg');

insert into Cart (buyer_id, listing_id, qty) values
    (1, 1, 1),
    (1, 2, 2),
    (1, 3, 2),
    (1, 4, 1);

insert into Purchase (buyer_id, listing_id, qty) values
    (1, 1, 1),
    (1, 2, 10);

insert into Payment (buyer_id, name, card_no, expiry, cvc) values
    (1, 'blah', '1234 1234 1234 1234', '12/12', '123'),
    (1, 'blu', '3498 3498 3498 3498', '13/13', '123');

-- update foo's default payment to be this
update Buyer set default_card_no = '1234 1234 1234 1234' where buyer_id = 1;