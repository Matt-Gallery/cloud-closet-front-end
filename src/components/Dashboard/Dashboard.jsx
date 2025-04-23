import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { index } from "../../services/userService.js";
import { Link } from "react-router";

function Dashboard() {
  const { user } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await index();
      setUsers(fetchedUsers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) fetchUsers();
  }, []);

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        This is the dashboard page where you can see a list of all the users.
      </p>
      <div>
        {users.map((person) => (
          <Link to={`/users/${person._id}`}>
            <p>{person.username}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
