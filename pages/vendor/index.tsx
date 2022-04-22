import VendorLayout from '@/components/VendorLayout';
import db, { secureSession } from '@/lib/server';
import { ActionIcon, Button, Group, Modal, Table, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useEffect, useState } from 'react';
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
  };
}

type Listing = VendorListing['listing'];

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

function VendorDialog(props: {
  onClose(): void;
  onSubmit(value: Partial<Listing>): any;
  initialValue?: Partial<Listing>;
}) {
  const form = useForm({
    initialValues: props.initialValue || {},
    validationRules: {
      name: Boolean,
      price: Boolean,
    },
    errorMessages: {
      name: 'Name is required',
      price: 'Price is required',
    },
  });
  useEffect(() => {
    if (props.initialValue) form.setValues(props.initialValue);
  }, [props.initialValue]);
  return (
    <Modal
      title={(props.initialValue?.id ? 'Edit' : 'Add') + ' listing'}
      opened={!!props.initialValue}
      onClose={props.onClose}
    >
      <form onSubmit={form.onSubmit(props.onSubmit)}>
        <TextInput label="Name" {...form.getInputProps('name')} />
        <TextInput label="Price" {...form.getInputProps('price')} />
        <TextInput label="Description" {...form.getInputProps('description')} />
        <Group sx={{ paddingTop: 12 }}>
          <Button type="submit">{props.initialValue?.id ? 'Edit' : 'Add'}</Button>
          <Button color="red" onClick={props.onClose}>
            Cancel
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default function VendorListings({ items }: VendorListingProps) {
  const [row, setRow] = useState<Partial<Listing>>();
  const onClose = () => setRow(undefined);
  async function onSubmit(value: Listing) {
    if (row?.id) {
      console.log({ action: 'edit', value });
    } else {
      console.log({ action: 'add', value });
    }
    setRow(undefined);
  }
  return (
    <VendorLayout>
      <VendorDialog initialValue={row} onClose={onClose} onSubmit={onSubmit} />
      <Group>
        <Button onClick={() => setRow({})}>Add listing</Button>
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
                  <ActionIcon onClick={() => setRow({ ...listing })}>
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
