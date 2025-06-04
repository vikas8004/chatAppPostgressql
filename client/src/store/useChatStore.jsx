import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import axiosInstance from "../lib/axiosInstance";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data.data });
        } catch (error) {
            toast.error(error.response.data.error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log(res.data)
            set({ messages: res.data.data });
        } catch (error) {
            toast.error(error.response.data.error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            // console.log("Sending message:", messageData);
            const res = await axiosInstance.post(`/messages/send/${selectedUser.id}`, messageData);
            set({ messages: [...messages, res.data.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            console.log("New message received:", newMessage);
            // Check if the new message is for the currently selected user
            if (newMessage.sender_id !== selectedUser.id) {
                return; // Ignore messages not related to the selected user
            }

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },
}));