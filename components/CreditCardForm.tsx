import { Center, Group as Row, Card, Button, TextInput as InputField } from '@mantine/core';

import { fetchJson } from '@/lib/client';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/hooks';
import InputMask from 'react-input-mask';

declare global {
  interface Number {
    between(min: number, max: number): boolean;
  }
}

Number.prototype.between = function between(min, max) {
  return min <= this && this <= max;
};

const CreditCardForm = () => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: '',
      number: '',
      expiry: '',
      security: '',
    },
    validationRules: {
      name: Boolean,
      number: (value) => !Number.isNaN(+value.replaceAll(' ', '')),
      expiry: (value) => !Number.isNaN(+value.replace('/', '')),
      security: (value) => value.length.between(3, 4),
    },
    errorMessages: {
      name: 'Cardholder name is required',
      number: 'Card number is required',
      expiry: 'Card expiry is required',
      security: 'CVC is required',
    },
  });

  // Form onSubmit handler
  const handleSubmit = async (values: typeof form.values) => {
    if (form.validate()) {
      const res = await fetchJson('/api/payment', values, { method: 'POST' });
      if (res.status < 400) {
        router.reload();
      }
    }
  };

  return (
    <Center>
      <Row>
        <div className="CardPaymentForm">
          <Card className="shadow-sm">
            <h3 className="CardPaymentForm-Title">Pay with Credit Card</h3>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <InputField label="Cardholder name" name="name" {...form.getInputProps('name')} />
              <InputMask mask="9999 9999 9999 9999" {...form.getInputProps('number')}>
                {(props: any) => <InputField label="Card number" name="number" {...props} />}
              </InputMask>
              <Row>
                <InputMask mask="99/99" {...form.getInputProps('expiry')}>
                  {(props: any) => <InputField label="MM/YY" name="expiry" {...props} />}
                </InputMask>
                <InputField
                  label="CVC"
                  maxLength={4}
                  name="security"
                  {...form.getInputProps('security')}
                />
              </Row>
              <Button type="submit">Add Payment</Button>
            </form>
          </Card>
        </div>
      </Row>
    </Center>
  );
};

export default CreditCardForm;
