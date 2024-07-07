import { useEffect, useState, useRef } from "react";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const response = await axios.get(
              `${allUsersRoute}/${currentUser._id}`
            );
            console.log("API response:", response.data); // Log the response
            if (response.data && Array.isArray(response.data.users)) {
              setContacts(response.data.users);
            } else {
              console.error(
                "API response is not an array of users:",
                response.data
              );
            }
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };

    fetchUsers();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const handleChatChange = (contact) => {
    console.log(contact);
    setCurrentChat(contact);
  };
  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          changeChat={handleChatChange}
          currentUser={currentUser}
        />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer
            socket={socket}
            currentUser={currentUser}
            currentChat={currentChat}
          />
        )}
      </div>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
