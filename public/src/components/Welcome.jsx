import styled from "styled-components";
import { useEffect, useState } from "react";
import Robot from "../assets/robot.gif";
const Welcome = ({}) => {
  const [userName, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      setUsername(user?.username);
    };
    fetchUser();
  }, []);

  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
};

export default Welcome;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
