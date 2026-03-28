import { NotificationItem, Role, User } from "@/types";

const users: Array<User & { password: string }> = [
  {
    id: "u_001",
    name: "Alex Admin",
    email: "admin@saasflow.dev",
    role: "admin",
    password: "admin1234",
  },
  {
    id: "u_002",
    name: "Uma User",
    email: "user@saasflow.dev",
    role: "user",
    password: "user1234",
  },
];

export function getPublicUsers(): User[] {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));
}

export function getUserByEmail(email: string): (User & { password: string }) | undefined {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): User {
  const newUser: User & { password: string } = {
    id: `u_${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  };
  users.push(newUser);
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
}

export function updateUserPassword(email: string, newPassword: string): boolean {
  const user = getUserByEmail(email);
  if (!user) return false;
  user.password = newPassword;
  return true;
}

export function getNotifications(role: Role): NotificationItem[] {
  const common: NotificationItem[] = [
    {
      id: "n_001",
      title: "Pipeline completed",
      description: "Your latest content analysis finished successfully.",
      createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      read: false,
    },
    {
      id: "n_002",
      title: "Team member invited",
      description: "A new teammate joined your workspace.",
      createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      read: false,
    },
  ];

  if (role === "admin") {
    common.unshift({
      id: "n_000",
      title: "Usage threshold alert",
      description: "You are at 82% of monthly compute budget.",
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      read: false,
    });
  }

  return common;
}
