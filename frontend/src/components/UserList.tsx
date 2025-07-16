'use client'

import { use } from "react";

interface UserListProps {
    users: Promise<Array<{
        id: number,
        name: string
    }>>
}

export default function UserList({
    users
}: UserListProps) {
    const loadedUsers = use(users);

    return (
        <div className="flex items-center justify-center flex-wrap gap-[25px]">
            {loadedUsers?.length > 1 ? loadedUsers.map((user, index) => (
                <p key={index} className="text-center py-1 px-2 rounded-[10px] border">
                    {user.name}
                </p>
            )) : (
                <p className="opacity-50"><i> Nenhum usuário encontrado </i></p>
            )}
        </div>
    );
}