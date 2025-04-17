"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fetchData, insertData, updateData, deleteData } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase/client";
import React from "react";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  description: string;
}

interface User {
  email: string;
}

interface Profile {
  id: string; // Keep original ID if it's still used elsewhere? Or remove if profile_id replaces it.
  profile_id: string; // Add profile_id from the view
  user_id: string;
  first_name: string;
  last_name: string;
  role_id: string;
  created_at: string;
  updated_at: string;
  users?: User;
  email?: string;
}

const userFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role_id: z.string().uuid("Invalid role ID"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_id: ""
    }
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      resetForm();
    } else {
      setEditingUser(null);
    }
  }, [isDialogOpen, editingUser, form]);

  const resetForm = () => {
    form.reset({
      first_name: editingUser ? editingUser.first_name : "",
      last_name: editingUser ? editingUser.last_name : "",
      email: editingUser ? editingUser.email : "",
      password: "",
      role_id: editingUser ? editingUser.role_id : (roles.find(r => r.name === 'User')?.id || '')
    });
  };

  const loadUsers = async () => {
    setLoading(true); // Use setLoading to match state variable
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users_with_profiles') // Use the view
        .select('*')
        .order('profile_created_at', { ascending: false }); // Order by view column if needed

      if (error) throw error;

      // Data from view should already have the email, adjust if view structure differs
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      const message = error.message || "An unknown error occurred";
      toast.error(`Failed to load users: ${message}`);
      setError(`Failed to load users: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    setError(null);
    try {
      console.log('Fetching roles...');
      const { data, error } = await supabase
        .from('roles')
        .select('*');

      if (error) {
        console.error('Error loading roles:', error);
        throw error;
      }

      console.log('Loaded roles:', data);
      setRoles(data || []);
      
      // Keep the logic to set default role_id
      if (!editingUser && data && data.length > 0) {
          const defaultRole = data.find(r => r.name === 'User');
          console.log('Default role:', defaultRole);
          form.reset({
            ...form.getValues(),
            role_id: defaultRole?.id || data[0].id
          });
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      const message = error.message || "An unknown error occurred";
      toast.error(`Failed to load roles: ${message}`);
      setError(`Failed to load roles: ${message}`);
    }
  };

  async function onSubmit(data: UserFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      // Add debugging for form data
      console.log('Form submission data:', {
        ...data,
        password: '********' // Don't log actual password
      });
      
      // Add debugging for selected role
      const selectedRole = roles.find(r => r.id === data.role_id);
      console.log('Selected role:', selectedRole);

      if (editingUser) {
        // If editing, only update profile data (excluding email/password)
        // Note: The original code didn't handle profile updates via API,
        // only direct DB update. We might need an API endpoint for this too.
        // For now, keeping the direct update logic for editing.
        const { password, email, ...profileData } = data;
        // Assuming updateData uses the standard client, which should be fine if RLS allows updates
        await updateData("profiles", editingUser.id, profileData);
        toast.success("Profile updated successfully.");
        console.log("Profile updated successfully (email/password not changed here).");
      } else {
        // If creating a new user, call the API endpoint
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error Response:', errorData); // Add API error logging
          throw new Error(errorData.error || 'An error occurred during user creation.');
        }
        
        toast.success("User created successfully via API.");
        console.log("User created successfully via API.");
        form.reset();
      }
      
      await loadUsers(); // Reload users after successful operation
      setIsDialogOpen(false); // Close dialog after successful operation
      
    } catch (err: any) {
      console.error("Error saving user:", err);
      const message = err.message || "An unknown error occurred";
      setError(`Failed to save user: ${message}`);
      toast.error(`Failed to save user: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(authUserId: string) {
    if (!authUserId) {
      console.error("handleDelete called without a valid authUserId");
      setError("Cannot delete user: Missing user ID.");
      return;
    }

    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setError(null);
      try {
        // Optimistic update - remove user from UI immediately
        setUsers(prevUsers => prevUsers.filter(user => user.user_id !== authUserId));
        
        console.log(`Attempting to delete user via API with auth ID: ${authUserId}`);
        const response = await fetch('/api/users/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ authUserId: authUserId }),
        });

        if (!response.ok) {
          // If deletion fails, revert the optimistic update
          const errorData = await response.json();
          console.error("API Error deleting user:", errorData);
          await loadUsers(); // Reload the original user list
          throw new Error(errorData.error || 'Failed to delete user via API');
        }

        console.log("User deleted successfully via API.");
        toast.success("User deleted successfully");
        
      } catch (err: any) {
        console.error("Error in handleDelete function:", err);
        setError(`Failed to delete user: ${err.message}`);
        toast.error(`Failed to delete user: ${err.message}`);
      }
    }
  }

  function handleEdit(user: Profile) {
    setEditingUser(user);
    setIsDialogOpen(true);
  }

  function handleAddNew() {
    setEditingUser(null);
    setIsDialogOpen(true);
  }

  function getRoleName(roleId: string) {
    const role = roles.find(r => r.id === roleId);
    return role?.name || roleId;
  }

  return (
    <div className="w-full py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl">Users Management</h1>
        <Button onClick={handleAddNew} variant="default">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>
      
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>User Management</AlertTitle>
        <AlertDescription>
          Manage user accounts, permissions, and roles across the system.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>All users with access to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="relative max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
              />
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.profile_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRoleName(user.role_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                          Edit
                        </Button>
                        <Button 
                          variant="destructive"
                          size="sm" 
                          onClick={() => user.user_id && handleDelete(user.user_id)} 
                          disabled={!user.user_id}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="">
              <span>{editingUser ? 'Edit User' : 'Add New User'}</span>
            </DialogTitle>
            <DialogDescription className="">
              <span>{editingUser ? 'Edit user details below. Email/password cannot be changed here.' : 'Fill in the details for the new user.'}</span>
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="user-profile-form">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@example.com" {...field} disabled={!!editingUser || isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!editingUser && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="role_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.length === 0 ? (
                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                              Loading roles...
                            </div>
                          ) : (
                            roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          
          <DialogFooter>
            <Button type="submit" form="user-profile-form" disabled={isSubmitting}>
              {isSubmitting ? (editingUser ? 'Saving...' : 'Adding User...') : (editingUser ? 'Save Changes' : 'Add User')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}