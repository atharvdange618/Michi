export type User = {
  id: string;
  name: string;
  email: string;
};

export async function fetchUser(id: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    email: `${id}@example.com`,
  };
}
