import { Link } from "michi";

export default function IndexPage() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/about">About →</Link>
      <br />
      <Link to="/user/atharv">User: atharv →</Link>
      <br />
      <Link to="/user/suraj">User: suraj →</Link>
    </div>
  );
}
