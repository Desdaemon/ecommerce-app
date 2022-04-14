import {
  AppShell,
  Card,
  Center,
  TextInput,
  Button,
  Stack,
  InputWrapper,
  Header,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import useUser from '../hooks/useUser';
import { identity } from '../lib/common';

const enum Action {
  login,
  signUp,
}

export default function Login() {
  const router = useRouter();
  const [action, setAction] = useState(router.query.signup == '' ? Action.signUp : Action.login);
  const [error, setError] = useState('');
  const user = useUser();
  const form = useForm({
    initialValues: {
      identity: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      identity: identity,
      password: identity,
      confirmPassword: (value, values) => action !== Action.signUp || value === values?.password,
    },
    errorMessages: {
      identity: 'Username or email required',
      password: 'Password required',
      confirmPassword: 'Passwords do not match',
    },
  });
  type FormValues = typeof form.values;

  function makeOnClick(_action: Action) {
    return function () {
      if (action !== _action) setAction(_action);
    };
  }

  async function handleFormSubmit(values: FormValues) {
    let err;
    switch (action) {
      case Action.login:
        err = await user.login(values);
        break;
      case Action.signUp:
        err = await user.signup({ username: values.identity, password: values.password });
        break;
    }
    if (err) setError(err);
    else router.push('/');
  }

  const newUser = action === Action.signUp;

  return (
    <AppShell
      header={
        <Header height="70">
          <ColorSchemeToggle />
        </Header>
      }
    >
      <Center>
        <Card>
          <InputWrapper error={error}>
            <form onSubmit={form.onSubmit(handleFormSubmit)}>
              <TextInput label="Username or email" {...form.getInputProps('identity')} />
              <TextInput label="Password" type="password" {...form.getInputProps('password')} />
              {newUser && (
                <TextInput
                  label="Confirm password"
                  type="password"
                  {...form.getInputProps('confirmPassword')}
                />
              )}
              <Stack sx={{ paddingTop: 12 }}>
                <Button type={newUser ? undefined : 'submit'} onClick={makeOnClick(Action.login)}>
                  Login
                </Button>
                <Button type={newUser ? 'submit' : undefined} onClick={makeOnClick(Action.signUp)}>
                  Sign up
                </Button>
              </Stack>
            </form>
          </InputWrapper>
        </Card>
      </Center>
    </AppShell>
  );
}
