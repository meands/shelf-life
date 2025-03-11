import { AppShell, Burger, Button, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBell,
  IconHome,
  IconLogout,
  IconTag,
  IconPlus,
  IconBarcode,
  IconChefHat,
} from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router";
import { modals } from "@mantine/modals";
import { CreateItemModal } from "../../modals/CreateItem";
import { ScanBarcodeForProduct } from "../../modals/ScanBarcode";
import { GenerateRecipes } from "../../modals/GenerateRecipes";

export function Main() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  const MenuItem = (route: (typeof routes)[keyof typeof routes]) => {
    const commonProps = {
      label: route.label,
      leftSection: <route.icon size="1rem" />,
      to: route.path,
      active: location.pathname === route.path,
      pl: route.path === "#" ? "xl" : "md", // TODO: think about more levels
      onClick: "onClick" in route ? route.onClick : undefined,
      component: route.path !== "#" ? Link : undefined,
    };

    return <NavLink key={route.label} {...commonProps} />;
  };

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
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            Expiry Tracker
          </Group>

          <Button
            variant="transparent"
            size="sm"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            <IconLogout />
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {Object.values(routes).map(MenuItem)}
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
  addItem: {
    label: "Add Item",
    path: "#",
    icon: IconPlus,
    onClick: () => modals.open({ children: <CreateItemModal /> }),
  },
  scanBarcode: {
    label: "Scan Barcode",
    path: "#",
    icon: IconBarcode,
    onClick: () => modals.open({ children: <ScanBarcodeForProduct /> }),
  },
  generateRecipes: {
    label: "Generate Recipes",
    path: "#",
    icon: IconChefHat,
    onClick: () => modals.open({ children: <GenerateRecipes /> }),
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
} as const;
