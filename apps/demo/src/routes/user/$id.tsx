import { Link, useParams } from "michi";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Hello, {id}</h1>
      <Link to="/">← Home</Link>
    </div>
  );
}
