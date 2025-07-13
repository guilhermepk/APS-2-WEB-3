'use client';

import findAllUsers from "@/apis/backend/users/find-all-users";
import UserList from "@/components/UserList";
import { Suspense } from "react";

export default function UsersPage() {
    const users = findAllUsers();

    return (
        <div className="flex items-center justify-center flex-col">
            <h1 className="text-center my-[50px]"> Usuários </h1>

            <Suspense fallback={<p>Carregando...</p>}>
                <UserList users={users} />
            </Suspense>
        </div>
    );
}