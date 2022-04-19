import { useState } from 'react';
import {
  Center,
  Group as Row,
  Stack as Col,
  Card,
  Button,
  TextInput as InputField,
} from '@mantine/core';

import { handleNumbersOnly } from '../lib/utils';
import { fetchJson } from '../lib/client';
import { useRouter } from 'next/router';

const CreditCardForm = () => {
  const router = useRouter();
  const [contact, setContact] = useState({
    name: '',
    number: '',
    expiry: '',
    security: '',
    errors: {},
  });

  // Input field onChange handler
  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // Input card expiry onKeyUp handler
  const handleCardExpiry = (e) => {
    let expiryDate = e.target.value;

    if (e.keyCode !== 8) {
      if (expiryDate > 1 && expiryDate.length === 1) {
        expiryDate = '0' + expiryDate + '/';
      } else if (expiryDate.length === 2) {
        expiryDate = expiryDate + '/';
      }

      setContact({ ...contact, expiry: expiryDate });
    } else {
      setContact({ ...contact, expiry: '' });
    }
  };

  // Input fields validation handler
  const handleValidation = () => {
    const { name, number, expiry, security, errors } = contact;
    let formIsValid = true;

    if (!name) {
      formIsValid = false;
      errors['name'] = 'Cardholder name is required';
    } else {
      errors['name'] = '';
    }

    if (!number) {
      formIsValid = false;
      errors['number'] = 'Card number is required';
    } else {
      errors['number'] = '';
    }

    if (!expiry) {
      formIsValid = false;
      errors['expiry'] = 'Expiry is required';
    } else {
      errors['expiry'] = '';
    }

    if (!security) {
      formIsValid = false;
      errors['security'] = 'CVV is required';
    } else {
      errors['security'] = '';
    }

    setContact({ ...contact, errors: errors });
    return formIsValid;
  };

  // Form onSubmit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (handleValidation()) {
      const res = await fetchJson('/api/payment', contact, { method: 'POST' });
      if (res.status < 400){
        router.reload();
      }
    }
  };

  const { name, number, expiry, security, errors } = contact;

  return (
    <Center>
      <Row>
        <Col>
          <div className="CardPaymentForm">
            <Card className="shadow-sm">
              <h3 className="CardPaymentForm-Title">Pay with Credit Card</h3>
              {/* <CardIconsList type={getCardType(number)} /> */}
              <form onSubmit={handleSubmit}>
                <InputField
                  // unique="cardholderName"
                  label="Cardholder name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <InputField
                  // unique="cardNumber"
                  label="Card number"
                  // maxLength="16"
                  name="number"
                  value={number}
                  onKeyDown={handleNumbersOnly}
                  onChange={handleChange}
                  error={errors.number}
                />
                <Row>
                  <Col>
                    <InputField
                      // unique="cardExpiry"
                      label="MM/YY"
                      // maxLength="5"
                      name="expiry"
                      value={expiry}
                      onKeyDown={handleNumbersOnly}
                      onKeyUp={handleCardExpiry}
                      onChange={handleChange}
                      error={errors.expiry}
                    />
                  </Col>
                  <Col>
                    <InputField
                      // unique="cardCvv"
                      label="CVV"
                      // maxLength="4"
                      name="security"
                      value={security}
                      onKeyDown={handleNumbersOnly}
                      onChange={handleChange}
                      error={errors.security}
                    />
                  </Col>
                </Row>
                <Button className="text-uppercase mb-3" type="submit">
                  Add Payment
                </Button>
              </form>
            </Card>
          </div>
        </Col>
      </Row>
    </Center>
  );
};

export default CreditCardForm;
