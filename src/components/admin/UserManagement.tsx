import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Calendar, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { hokApi } from '@/services/hokApi';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: string;
  createdAt?: string;
}

const UserManagement = () => {
  const { toast } = useToast();

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => hokApi.fetchUsers(),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => hokApi.deleteUser(id),
    onSuccess: () => {
      toast({ title: "User deleted", description: "The user was removed successfully" });
      usersQuery.refetch();
    },
    onError: (error: any) => {
      toast({ title: "Delete failed", description: error?.message || "Could not delete user", variant: "destructive" });
    },
  });

  if (usersQuery.isLoading) {
    return <div>Loading users...</div>;
  }

  const users: User[] = usersQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="text-sm text-muted-foreground">
          Total Users: {users.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">
                      {user.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.phone || ''}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={(user.role || '').toUpperCase() === 'ADMIN' ? 'default' : 'secondary'}>
                      {(user.role || 'CUSTOMER').toString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUser.mutate(user.id)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
