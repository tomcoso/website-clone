import { useNavigate } from "react-router";
import Button from "../components/Button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main>
      <h1>Home page</h1>
      <Button action={() => navigate("new-community")}>Create Community</Button>
    </main>
  );
};

export default Home;
