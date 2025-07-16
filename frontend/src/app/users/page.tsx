'use client';

import findAllUsers from "@/apis/backend/users/find-all-users";
import { FindAllUsersResponseDto } from "@/apis/backend/users/models/dtos/find-all-users-response.dto";
import AddButton from "@/components/AddButton";
import UserList from "@/components/UserList";
import { redirect } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<Promise<FindAllUsersResponseDto> | null>(null);

    useEffect(() => {
        setUsers(findAllUsers());
    }, []);

    return (
        <div className="flex items-center justify-center flex-col">
            <h1 className="text-center my-[50px]"> Usuários </h1>

            <AddButton className="mb-16" onClick={() => redirect('users/create')} text="Novo usuário" />

            <Suspense fallback={<p>Carregando...</p>}>
                {users && (
                    <UserList users={users} />
                )}
            </Suspense>
        </div>
    );
}