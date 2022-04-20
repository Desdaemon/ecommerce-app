import { TextInput, Button, Stack, InputWrapper } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { fetchJson, useLoading } from '@/lib/client';
import { identity } from '@/lib/common';
import type { Login, Signup } from '@/lib/types';

const enum Action {
  login,
  signUp,
}

async function login(
  payload: Login,
  options: { asVendor?: boolean; fetch: typeof fetch } = { fetch }
) {
  const { asVendor, fetch } = options;
  const res = await fetchJson(`/api/login${asVendor ? '?type=vendor' : ''}`, payload, {
    method: 'POST',
    fetch,
  });
  if (res.status < 400) return null;
  return new Error(await res.text());
}

async function signup(
  payload: Signup,
  options: { asVendor?: boolean; fetch: typeof fetch } = { fetch }
) {
  const { asVendor, fetch } = options;
  const res = await fetchJson(`/api/signup${asVendor ? '?type=vendor' : ''}`, payload, {
    method: 'POST',
    fetch,
  });
  if (res.status < 400) return null;
  return new Error(await res.text());
}

const emailRegex = /[^@]+@[^.]+\..+/;

interface LoginPageProps {
  nextRoute?: string;
}

export default function LoginPage({ nextRoute }: LoginPageProps) {
  const router = useRouter();
  const { fetch } = useLoading();
  const [action, setAction] = useState(Action.login);
  const [error, setError] = useState('');
  const form = useForm({
    initialValues: {
      identity: '',
      password: '',
      email: '',
      confirmPassword: '',
    },
    validationRules: {
      identity: identity,
      password: identity,
      email: (value) => action !== Action.signUp || emailRegex.test(value),
      confirmPassword: (value, values) => action !== Action.signUp || value === values?.password,
    },
    errorMessages: {
      identity: 'Username required',
      password: 'Password required',
      email: 'Email required, or invalid email',
      confirmPassword: 'Passwords do not match',
    },
  });
  // const targetRoute = nextRoute || router.pathname;
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
        err = await login(values, { fetch });
        break;
      case Action.signUp:
        err = await signup({ ...values, username: values.identity }, { fetch });
        break;
    }
    if (err) {
      setError(err.message);
    } else if (!nextRoute || nextRoute === router.pathname) {
      location.reload();
    } else {
      router.push(nextRoute);
    }
  }

  const newUser = action === Action.signUp;

  return (
    <InputWrapper error={error}>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <TextInput label="Username" autoComplete="username" {...form.getInputProps('identity')} />
        <TextInput
          label="Password"
          type="password"
          autoComplete="password"
          {...form.getInputProps('password')}
        />
        {newUser && (
          <>
            <TextInput
              label="Confirm password"
              type="password"
              {...form.getInputProps('confirmPassword')}
            />
            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              {...form.getInputProps('email')}
            />
          </>
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
  );
}
