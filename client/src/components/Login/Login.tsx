import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSignIn } from "@api/authentication";
import { useCreateUser } from "@api/user";
import { useNavigate } from "react-router";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <Container size={420} my={40}>
      <Title ta="center">
        {isRegistering ? "Create an account" : "Welcome back!"}
      </Title>

      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isRegistering
          ? "Already have an account? "
          : "Do not have an account yet? "}
        <Anchor
          size="sm"
          component="button"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Sign in" : "Create account"}
        </Anchor>
      </Text>

      {isRegistering ? <RegisterForm /> : <LoginForm />}
    </Container>
  );
}

function RegisterForm() {
  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();
  const navigate = useNavigate();

  const registerForm = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      displayName: (value) => (value.length < 2 ? "Name is too short" : null),
      password: (value) => (value.length < 6 ? "Password is too short" : null),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleRegister = registerForm.onSubmit((values) => {
    createUser(
      {
        email: values.email,
        password: values.password,
        displayName: values.displayName,
      },
      {
        onSuccess: (data) => {
          notifications.show({
            title: "Success",
            message: "Account created!",
            color: "green",
          });
          localStorage.setItem("token", data.token);
          navigate("/");
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message: error.message,
            color: "red",
          });
        },
      }
    );
  });

  return (
    <form onSubmit={handleRegister} autoComplete="off">
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Display Name"
          placeholder="John Doe"
          withAsterisk
          {...registerForm.getInputProps("displayName")}
        />
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          withAsterisk
          mt="md"
          {...registerForm.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          withAsterisk
          mt="md"
          {...registerForm.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          withAsterisk
          mt="md"
          {...registerForm.getInputProps("confirmPassword")}
        />
        <Button fullWidth mt="xl" type="submit" loading={isCreatingUser}>
          Create account
        </Button>
      </Paper>
    </form>
  );
}

function LoginForm() {
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();
  const navigate = useNavigate();

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleLogin = loginForm.onSubmit((values) => {
    signIn(values, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        navigate("/");
      },
      onError: (error) => {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    });
  });

  return (
    <form onSubmit={handleLogin} autoComplete="off">
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          withAsterisk
          {...loginForm.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          withAsterisk
          mt="md"
          {...loginForm.getInputProps("password")}
        />
        <Button fullWidth mt="xl" type="submit" loading={isSigningIn}>
          Sign in
        </Button>
      </Paper>
    </form>
  );
}
