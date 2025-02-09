import { partition } from "@shared/utils/arr";
import prisma from "./db";
import nodemailer from "nodemailer";

interface ItemToNotify {
  id: number;
  name: string;
  daysAbs: number;
  expired: boolean;
  user: {
    email: string;
    displayName: string;
  };
}

async function getExpiringItems(): Promise<ItemToNotify[]> {
  const reminders = await prisma.reminder.findMany({
    where: { isEnabled: true },
    include: {
      user: { select: { email: true, displayName: true } },
      item: { select: { id: true, name: true, expiryDate: true } },
    },
  });

  const [itemReminders, globalReminders] = partition(
    reminders,
    (r) => !!r.itemId
  );

  const itemNotifications = itemReminders
    .filter((reminder) => reminder.item)
    .map((reminder) => {
      const daysUntilExpiry = getDaysUntilExpiry(reminder.item!.expiryDate);
      return {
        reminder,
        daysUntilExpiry,
      };
    })
    .filter(
      ({ reminder, daysUntilExpiry }) =>
        daysUntilExpiry <= reminder.daysBeforeExpiry
    )
    .map(({ reminder, daysUntilExpiry }) => ({
      ...reminder.item!,
      expired: daysUntilExpiry < 0,
      daysAbs: daysUntilExpiry,
      user: reminder.user,
    }));

  const globalNotifications = await Promise.all(
    globalReminders.map(async (globalReminder) => {
      const userItems = await prisma.item.findMany({
        where: {
          userId: globalReminder.userId,
          NOT: { reminders: { some: {} } },
        },
      });

      return userItems
        .map((item) => {
          const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
          return { item, daysUntilExpiry };
        })
        .filter(
          ({ daysUntilExpiry }) =>
            daysUntilExpiry <= globalReminder.daysBeforeExpiry
        )
        .map(({ item, daysUntilExpiry }) => ({
          ...item,
          expired: daysUntilExpiry < 0,
          daysAbs: daysUntilExpiry,
          user: globalReminder.user,
        }));
    })
  ).then((arrays) => arrays.flat());

  return [...itemNotifications, ...globalNotifications];
}

function getDaysUntilExpiry(expiryDate: Date): number {
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function groupItemsByUser(items: ItemToNotify[]) {
  return items.reduce(
    (acc, item) => ({
      ...acc,
      [item.user.email]: {
        items: [...(acc[item.user.email]?.items || []), item],
        user: item.user,
      },
    }),
    {} as Record<
      string,
      { items: ItemToNotify[]; user: { email: string; displayName: string } }
    >
  );
}

function generateEmailContent(
  items: ItemToNotify[],
  user: { displayName: string }
): string {
  const [expiredItems, inDateItems] = partition(items, (item) => item.expired);

  const createItemList = (items: ItemToNotify[], expired: boolean) =>
    items
      .map(
        (item) => `
    <li>
      <strong>${item.name}</strong> - Status: ${
          expired
            ? item.daysAbs * -1 + " days past expiry"
            : item.daysAbs + " days until expiry"
        }
    </li>`
      )
      .join("");

  const sections = [
    inDateItems.length > 0 &&
      `
      <p>The following items in your Expiry Tracker are nearing their expiry date:</p>
      <ul>${createItemList(inDateItems, false)}</ul>`,
    expiredItems.length > 0 &&
      `
      <p>You${
        inDateItems.length > 0 ? " also " : " "
      }have the following items that have expired:</p>
      <ul>${createItemList(expiredItems, true)}</ul>`,
  ].filter(Boolean);

  return `
    <html>
      <body>
        <h2>Hello ${user.displayName},</h2>
        ${sections.join("\n")}
        <p>Please check these items and take appropriate action.</p>
        <p>Expiry Tracker</p>
      </body>
    </html>
  `;
}

async function sendExpiryNotifications() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const items = await getExpiringItems();
  const itemsByUser = groupItemsByUser(items);

  Object.entries(itemsByUser).map(([email, { items, user }]) => {
    const emailContent = generateEmailContent(items, user);
    console.log(emailContent);

    // return transporter.sendMail({
    //   from: process.env.SMTP_FROM,
    //   to: email,
    //   subject: "Items Nearing Expiry - Expiry Tracker",
    //   html: emailContent,
    // });
  });
}

// Only if this is the main module
if (require.main === module) {
  sendExpiryNotifications().catch(console.error);
}
