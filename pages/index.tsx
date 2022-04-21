import { CardItem } from '@/components/Card';
import db from '@/lib/server';
import { Grid } from '@mantine/core';
import { GetStaticProps } from 'next';

interface HomepageProps {
  items: Listing[];
}

const placeholder = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

// const homepageStmt = db
//   .prepare<[]>(
//     `--sql
//     select L.name, L.description, L.price,
//            LI.url as link,
//            L.listing_id as id
//     from Listing L
//     -- outer join, so that listings appear even
//     -- if there are no images, in which case 'link'
//     -- will be null.
//     left outer join ListingImages LI
//     on
//       L.listing_id = LI.listing_id`
//   )
//   .bind();

const getHomepage = () =>
  db.from('listing').select(
    `name, description, price,
     id: listing_id,
     img: listingimages(link: url)`
  );

interface Listing {
  id: string;
  name: string;
  description: string;
  price: string;
  img: { link?: string }[];
}

export const getStaticProps: GetStaticProps = async () => {
  const { data, error } = await getHomepage();
  return {
    props: { items: error ? [] : data },
    revalidate: 60, // seconds
  };
};

export default function HomePage({ items }: HomepageProps) {
  return (
    <Grid>
      {items.map((item) => (
        <Grid.Col key={item.id} lg={3} md={4} sm={6}>
          <CardItem {...item} link={item.img[0].link || placeholder} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
