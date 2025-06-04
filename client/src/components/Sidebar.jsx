import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import { Users } from "lucide-react";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    // console.log("selectedUser", selectedUser)

    const { onlineUsers } = useAuthStore();
    // console.log("onlineUsers:", onlineUsers);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    // console.log("users:", users);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = showOnlineOnly
        ? users.filter((user) => {
            // console.log("user.id:", user.id, user);
            return onlineUsers.includes(String(user.id))
        })
        : users;
    console.log("filteredUsers:", filteredUsers);
    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                {/* TODO: Online filter toggle */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?.id === user.id ? "bg-base-300 ring-1 ring-base-300" : ""} cursor-pointer
            `}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profile_pic || "/avatar.png"}
                                alt={user.full_name}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(String(user.id)) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>

                        {/* User info - only visible on larger screens */}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.full_name}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(String(user.id)) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    );
};
export default Sidebar;