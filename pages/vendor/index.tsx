import VendorLayout from '@/components/VendorLayout';
import db, { secureSession } from '@/lib/server';
import { ActionIcon, Button, Group, Table } from '@mantine/core';
import { Edit, Trash } from 'tabler-icons-react';

interface VendorListingProps {
  items: VendorListing[];
}

interface VendorListing {
  listing: {
    id: string;
    name: string;
    price: string;
    description: string;
    // img: { url: string }[];
  };
}

const getVendorListings = (vendorId: string) =>
  db
    .from('vendorlistings')
    .select(
      ` listing!inner(
        id: listing_id,
        name,
        price,
        description
      )`
    )
    .eq('vendor_id', vendorId);

export const getServerSideProps = secureSession<VendorListingProps>(async ({ req }) => {
  if (!req.session.user?.isVendor) {
    return {
      redirect: {
        destination: '/',
      },
      props: undefined as any,
    };
  }
  const { error, data } = await getVendorListings(req.session.user.userId);
  if (error) console.error(error);
  return {
    props: { items: error ? [] : data },
  };
});

export default function VendorListings({ items }: VendorListingProps) {
  return (
    <VendorLayout>
      <Group>
        <Button>Add listing</Button>
      </Group>
      <Table striped highlightOnHover>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Description</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {items.map(({ listing }) => (
            <tr key={listing.id}>
              <td>{listing.id}</td>
              <td>{listing.name}</td>
              <td style={{ textAlign: 'right' }}>${listing.price}</td>
              <td style={{ maxWidth: 700 }}>{listing.description}</td>
              <td>
                <Group>
                  <ActionIcon>
                    <Edit size={16} />
                  </ActionIcon>
                  <ActionIcon>
                    <Trash size={16} />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </VendorLayout>
  );
}
