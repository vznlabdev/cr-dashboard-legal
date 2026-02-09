import { User, Bell, Settings } from "lucide-react";

export interface SettingsMenuItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badge?: string;
  description?: string;
  keywords?: string[];
  children?: SettingsMenuItem[];
}

export interface SettingsMenuSection {
  id: string;
  label: string;
  items: SettingsMenuItem[];
}

/** Legal-relevant settings only: Profile, Notification Preferences, Preferences */
export const settingsMenu: SettingsMenuSection[] = [
  {
    id: "legal-settings",
    label: "Settings",
    items: [
      {
        id: "account",
        label: "Profile",
        href: "/settings/account",
        icon: User,
        description: "Personal info, avatar, and email",
        keywords: ["profile", "avatar", "email", "personal"],
      },
      {
        id: "notifications",
        label: "Notification Preferences",
        href: "/settings/notifications",
        icon: Bell,
        description: "Which alerts to receive (compliance, expirations, review assignments, legislation)",
        keywords: ["alerts", "compliance", "contract", "review", "legislation", "notifications"],
      },
      {
        id: "preferences",
        label: "Preferences",
        href: "/settings/preferences",
        icon: Settings,
        description: "Theme (light/dark), default view settings, date format",
        keywords: ["theme", "dark", "light", "view", "date", "format", "display"],
      },
    ],
  },
];

/**
 * Get all menu items as a flat array (used by settings sidebar)
 */
export function getAllMenuItems(): SettingsMenuItem[] {
  const items: SettingsMenuItem[] = [];

  settingsMenu.forEach((section) => {
    section.items.forEach((item) => {
      items.push(item);
      if (item.children) {
        items.push(...item.children);
      }
    });
  });

  return items;
}

/**
 * Search menu items by keyword
 */
export function searchMenuItems(query: string): SettingsMenuItem[] {
  const lowerQuery = query.toLowerCase();
  const allItems = getAllMenuItems();

  return allItems.filter((item) => {
    const labelMatch = item.label.toLowerCase().includes(lowerQuery);
    const descriptionMatch = item.description?.toLowerCase().includes(lowerQuery);
    const keywordMatch = item.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(lowerQuery)
    );

    return labelMatch || descriptionMatch || keywordMatch;
  });
}

/**
 * Get breadcrumb trail for a given path
 */
export function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const breadcrumbs: { label: string; href: string }[] = [
    { label: "Settings", href: "/settings" },
  ];

  const allItems = getAllMenuItems();
  const currentItem = allItems.find((item) => item.href === pathname);

  if (currentItem) {
    breadcrumbs.push({
      label: currentItem.label,
      href: currentItem.href,
    });
  }

  return breadcrumbs;
}
