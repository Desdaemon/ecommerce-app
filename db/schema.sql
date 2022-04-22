-- SQLite-specific code

pragma foreign_keys = on;

-- Schemas
-- On PostgreSQL, replace "integer autoincrement" with "serial"
    
create table Buyer (
    buyer_id integer primary key autoincrement,
    email varchar,
    username varchar unique not null,
    password varchar not null,
    default_card_no varchar
);

create table Vendor (
    vendor_id integer primary key autoincrement,
    email varchar,
    username varchar unique not null,
    password varchar not null
);

create table Listing (
    listing_id integer primary key autoincrement,
    name varchar not null,
    price decimal(6, 2) not null,
    description text,
    status varchar
);

-- Testing

create table Payment (
    buyer_id integer not null,
    name varchar,
    card_no varchar not null,
    expiry varchar not null,
    cvc varchar not null,
    primary key (buyer_id, card_no),
    foreign key (buyer_id) references Buyer(buyer_id)
        on update cascade on delete cascade
);

-- Relationships

create table Cart (
    buyer_id integer,
    listing_id integer,
    qty integer not null check (qty > 0) default 1,
    primary key (buyer_id, listing_id),
    foreign key (buyer_id) references Buyer(buyer_id)
        on update cascade on delete cascade,
    foreign key (listing_id) references Listing(listing_id)
        on update cascade on delete cascade
);

create table Purchase (
    purchase_id integer primary key autoincrement,
    buyer_id integer,
    listing_id integer,
    card_no varchar,
    date timestamptz not null default NOW(),
    qty integer not null check (qty > 0),
    foreign key (buyer_id) references Buyer(buyer_id)
        on update cascade on delete cascade,
    foreign key (listing_id) references Listing(listing_id)
        on update cascade on delete cascade
);

create table ListingImages (
    image_id integer primary key autoincrement,
    listing_id integer not null,
    url varchar,
    foreign key (listing_id) references Listing(listing_id)
        on update cascade on delete cascade
);

create table VendorListings (
    vendor_id integer not null,
    listing_id integer unique not null,
    primary key (vendor_id, listing_id),
    foreign key (vendor_id) references Vendor(vendor_id)
        on update cascade on delete cascade,
    foreign key (listing_id) references Listing(listing_id)
        on update cascade on delete cascade
);

-- Views

create view BuyerPayments as (
    select P.*, (P.card_no = B.default_card_no) as isDefault
    from Payment P
    inner join Buyer B
    on
        B.buyer_id = P.buyer_id
);