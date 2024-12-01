import { auth } from "../auth";

export default async function UserAvatar() {
  const session = await auth();
  console.log(session);
  if (!session) return null;
  if (!session.user) return null;
  if (!session.user.image) return null;

  return (
    <div>
      <img src={session.user.image} alt="User Avatar" />
      <p>{session.user.name}</p>
      <p>{session.user.email}</p>
    </div>
  );
}
