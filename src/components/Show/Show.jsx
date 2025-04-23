import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { show } from "../../services/userService.js";

function Show() {
  const { id } = useParams();

  const [person, setPerson] = useState({});

  const fetchPerson = async () => {
    try {
      const fetchedPerson = await show(id);
      setPerson(fetchedPerson);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  return (
    <div>
      <h1>
        {person.user ? person.user.username : "You ain't supposed to be here."}
      </h1>
    </div>
  );
}

export default Show;
