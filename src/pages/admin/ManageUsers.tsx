import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "@/postService";
import { IUser } from "@/interfaces/IUser";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

function ManageUsers() {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Failed to load users.</p>;
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Password</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: IUser) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.password}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ManageUsers;
