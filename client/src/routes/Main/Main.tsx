import { AppShell, Burger, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBell, IconHome, IconTag } from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router";

export function Main() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: !opened, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          Expiry Tracker
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {Object.values(routes).map((route) => (
          <NavLink
            key={route.path}
            label={route.label}
            leftSection={<route.icon size="1rem" />}
            component={Link}
            to={route.path}
            active={location.pathname === route.path}
          />
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
    label: "Items",
    path: "/items",
    icon: IconHome,
  },
  labels: {
    label: "Labels",
    path: "/labels",
    icon: IconTag,
  },
  reminders: {
    label: "Reminders",
    path: "/reminders",
    icon: IconBell,
  },
};
