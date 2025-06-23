import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./UserService";
import { IUser } from "../auth/IUser";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function ManageUsers() {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const navigate = useNavigate();

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Failed to load users.</p>;
  return (
    <>
      <ReturnToBookListButton />
      <div className="w-[500px] mx-auto p-6 border rounded shadow">
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

                <TableCell>
                  <Button
                    onClick={() =>
                      navigate(
                        `/admin/manage-users/order-history?userId=${user.id}`
                      )
                    }
                  >
                    Order History
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ManageUsers;
