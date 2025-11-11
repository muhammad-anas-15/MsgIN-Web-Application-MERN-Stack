import { createContext, useContext, useEffect, useState, useCallback } from "react"; // Added useCallback to imports
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) =>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const {socket, axios} = useContext(AuthContext);

    // --- FUNCTION TO GET ALL USERS FOR SIDEBAR ---
    const getUsers = useCallback(async ()=>{
        try {
            const {data} = await axios.get("/api/messages/users");
            
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } 
          catch (error) {
           toast.error(error.message)
        }
    }, [axios])

    // --- FUNCTION TO GET MESSAGES FOR SELECTED USER ---
    const getMessages = useCallback (async(userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } 
        catch (error) {
            toast.error(error.message)
        }
    }, [axios])

    // --- FUNCTION TO SEND MESSAGE TO SELECTED USER ---
    const sendMessage = useCallback ( async (messageData) =>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            
            if(data.success){
                setMessages((prevMessages) => [...prevMessages, data.newMessage])
            }

            else{
                toast.error(data.message);
            }
        } 
        catch (error) {
            toast.error(error.response?.data?.message || error.message); // Improved error handling
        }
    } , [axios, selectedUser])

    // --- SOCKET.IO LISTENER FOR NEW MESSAGES ---
    const subscribeToMessages = () =>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // --- SOCKET.IO LISTENER FOR USER PROFILE UPDATES (The Fix for Stale Names) ---
    useEffect(() => {
        // We only need to set up the listener if the socket and getUsers are available
        if (!socket || !getUsers) return; 

        // Listen for the event emitted from the backend when a user updates their profile
        socket.on("userUpdated", (updatedUser) => {
            // Refetch the entire user list to ensure we get the updated name and profilePic 
            getUsers(); 
        });

        // Cleanup listener when component unmounts
        return () => {
            socket.off("userUpdated");
        };
    }, [socket, getUsers]); // Include getUsers in dependencies

    // --- UN/SUBSCRIBE TO MESSAGES EFFECT ---
    useEffect(()=>{
        subscribeToMessages();
        // Cleanup function for messages
        return ()=> {
            if (socket) socket.off("newMessage"); 
        };
    }, [socket, selectedUser])

    // --- CONTEXT VALUE ---
    const value = {
        messages, 
        users, 
        selectedUser, 
        getUsers, 
        getMessages, 
        sendMessage, 
        setSelectedUser, 
        unseenMessages, 
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}