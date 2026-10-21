"use client";

import { useState } from "react";
import { UserStatsCards } from "./user-stats-cards";
import { UserFilters } from "./user-filters";
import { UsersTable } from "./users-table";
import { CreateUserModal } from "./create-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { ChangeRoleModal } from "./change-role-modal";
import { ResetPasswordModal } from "./reset-password-modal";
import { DeleteUserModal } from "./delete-user-modal";
import type { UserListItem, UserStats } from "../types";

export function UserManagementView({
  users,
  totalCount,
  totalPages,
  currentPage,
  stats,
  currentAdminId,
}: {
  users: UserListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  stats: UserStats;
  currentAdminId: string;
}) {
  const [modalMode, setModalMode] = useState<
    "create" | "edit" | "role" | "password" | "delete" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

  function handleOpenCreate() {
    setSelectedUser(null);
    setModalMode("create");
  }

  function handleOpenEdit(user: UserListItem) {
    setSelectedUser(user);
    setModalMode("edit");
  }

  function handleOpenChangeRole(user: UserListItem) {
    setSelectedUser(user);
    setModalMode("role");
  }

  function handleOpenResetPassword(user: UserListItem) {
    setSelectedUser(user);
    setModalMode("password");
  }

  function handleOpenDelete(user: UserListItem) {
    setSelectedUser(user);
    setModalMode("delete");
  }

  function handleCloseModal() {
    setModalMode(null);
    setSelectedUser(null);
  }

  return (
    <div className="space-y-6">
      {/* 1. Metric Stats Cards */}
      <UserStatsCards stats={stats} />

      {/* 2. Filter Bar & Actions */}
      <UserFilters onAddUser={handleOpenCreate} />

      {/* 3. Users Table / Cards Stack */}
      <UsersTable
        currentAdminId={currentAdminId}
        currentPage={currentPage}
        onChangeRole={handleOpenChangeRole}
        onDeleteUser={handleOpenDelete}
        onEditUser={handleOpenEdit}
        onResetPassword={handleOpenResetPassword}
        totalCount={totalCount}
        totalPages={totalPages}
        users={users}
      />

      {/* 4. CRUD Modals */}
      <CreateUserModal
        onClose={handleCloseModal}
        open={modalMode === "create"}
      />

      <EditUserModal
        onClose={handleCloseModal}
        user={modalMode === "edit" ? selectedUser : null}
      />

      <ChangeRoleModal
        currentAdminId={currentAdminId}
        onClose={handleCloseModal}
        user={modalMode === "role" ? selectedUser : null}
      />

      <ResetPasswordModal
        onClose={handleCloseModal}
        user={modalMode === "password" ? selectedUser : null}
      />

      <DeleteUserModal
        currentAdminId={currentAdminId}
        onClose={handleCloseModal}
        user={modalMode === "delete" ? selectedUser : null}
      />
    </div>
  );
}
