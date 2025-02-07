import { AppShell, Burger, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useLocation } from "react-router";

export function Main() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: "sm",
        collapsed: { desktop: !opened, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {Object.entries(routes).map(([section, route]) => (
          <Link to={route.path} style={{ textDecoration: "none" }}>
            <Button
              fullWidth
              variant={location.pathname === route.path ? "light" : "subtle"}
            >
              {section}
            </Button>
          </Link>
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

const routes = {
  items: {
    path: "/items",
  },
  labels: {
    path: "/labels",
  },
};
