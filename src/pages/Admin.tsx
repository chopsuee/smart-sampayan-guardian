import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Users, RefreshCw } from 'lucide-react';

// Extended User type to include password for display purposes
interface ExtendedUser extends User {
  password?: string;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
  });
  const [open, setOpen] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  
  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // This would be an API call in a real app
        // For now, we'll use a mock list of users
        const mockUsers: ExtendedUser[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            devices: [],
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            devices: [],
          },
          {
            id: '3',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            devices: [],
          },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      }
    };
    
    fetchUsers();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Update the password generation function to create exactly 4-character passwords
  const generateRandomPassword = () => {
    // Use a fixed length of 4 characters for passwords
    const length = 4;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const generateRandomEmail = (name: string) => {
    const domain = "sampayan.com";
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return `${sanitizedName}${randomString}@${domain}`;
  };

  const handleGenerateCredentials = () => {
    if (!newUser.name) {
      toast({
        title: "Name Required",
        description: "Please enter a name to generate credentials",
        variant: "destructive",
      });
      return;
    }

    const email = generateRandomEmail(newUser.name);
    const password = generateRandomPassword();
    
    setNewUser({
      ...newUser,
      email,
    });
    
    setGeneratedCredentials({
      email,
      password,
    });
    
    toast({
      title: "Credentials Generated",
      description: "User credentials have been generated",
    });
  };

  const handleAddUser = () => {
    // Validate input
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Invalid Input",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: "Duplicate Email",
        description: "A user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    // Add new user with password if available
    const newId = `user-${Date.now()}`;
    const userToAdd: ExtendedUser = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: 'user',
      devices: [],
      // Add the password from generated credentials if available
      password: generatedCredentials?.password,
    };

    setUsers([...users, userToAdd]);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully`,
    });
    
    // Reset form, credentials and close dialog
    setNewUser({ name: '', email: '' });
    setGeneratedCredentials(null);
    setOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    // Prevent deleting the current admin user
    if (user?.id === userId) {
      toast({
        title: "Action Denied",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

    // Remove user from the list
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: "User has been removed successfully",
    });
  };

  if (!user || user.role !== 'admin') {
    return null; // Don't render anything if not admin
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6" />
                User Management
              </CardTitle>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sampayan hover:bg-sampayan-dark">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account for Smart Sampayan.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-right">
                      Email
                    </label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleGenerateCredentials}
                        title="Generate random credentials"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {generatedCredentials && (
                    <div className="col-span-4 p-3 border rounded-md bg-muted">
                      <h4 className="font-semibold mb-2">Generated Credentials</h4>
                      <p className="text-sm mb-1">Email: <span className="font-mono">{generatedCredentials.email}</span></p>
                      <p className="text-sm mb-2">Password: <span className="font-mono">{generatedCredentials.password}</span></p>
                      <p className="text-xs text-muted-foreground">Save these credentials. The password won't be shown again.</p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} className="bg-sampayan hover:bg-sampayan-dark">
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of all Smart Sampayan users</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role || 'user'}</TableCell>
                    <TableCell>{user.password || '••••'}</TableCell>
                    <TableCell>{user.devices.length}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin'}
                        title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;
