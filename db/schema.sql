pragma foreign_keys = on;

-- Schemas
    
create table Buyer (
    buyer_id integer primary key autoincrement,
    email varchar unique,
    username varchar unique not null,
    password varchar not null
);

create table Vendor (
    vendor_id integer primary key autoincrement,
    email varchar unique,
    username varchar unique not null,
    password varchar not null
);

create table Listing (
    listing_id integer primary key autoincrement,
    vendor_id integer,
    status integer,
    name varchar,
    price decimal,
    description text,
    foreign key (vendor_id) references Vendor(vendor_id)
        on update cascade on delete cascade
);

create table Payment (
    buyer_id integer not null,
    card_no char(16) not null,
    expiry char(4) not null,
    cvc char(3) not null,
    primary key (buyer_id, card_no),
    foreign key (buyer_id) references Buyer(buyer_id)
        on update cascade on delete cascade
);

-- Relationships

create table Purchase (
    status varchar not null default 'cart'
        check (status in ('cart', 'order')),
    buyer_id integer,
    -- vendor_id integer,
    listing_id integer,
    card_no char(16),
    date datetime not null default current_timestamp,
    order_date datetime,
    qty integer not null check (qty > 0),
    primary key (buyer_id, listing_id),
    foreign key (buyer_id) references Buyer(buyer_id)
        on update cascade on delete cascade,
    foreign key (listing_id) references Listing(listing_id)
        on update cascade on delete cascade
    -- foreign key (vendor_id) references Vendor(vendor_id)
    --     on update cascade on delete cascade
);

create table ListingImages (
    image_id integer primary key autoincrement,
    listing_id integer not null,
    url varchar,
    foreign key (listing_id) references Listing(listing_id)
        on update cascade on delete cascade
);
