'use client'
import * as React from "react";
import { useState , useEffect} from "react";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signOut, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';
import { toast } from 'react-hot-toast';
// import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast

import { useRouter } from 'next/navigation';

export default function Register() {
  // const router = useRouter();
  // const { data: session } = useSession();
  //   console.log(session);
  //   const isLoading = status === "loading"; 
    
    const router = useRouter();
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    const initialFormData = {
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [userExists, setUserExists] = useState(false);

    // Check if user exists whenever email changes
    useEffect(() => {
        if (!formData.email) return;
        checkUserExists(formData.email);
    }, [formData.email]);

    // Redirect logic based on session
    useEffect(() => {
        if (isLoading) return; // Prevent effect from running when session status is loading
        if (!session) {
            toast.error('You must be signed in to access the register page.');
            router.push('/signin');
            return;
        }
        setFormData({
            ...formData,
            name: session.user.name,
            email: session.user.email,
        });
    }, [session, isLoading]);

    const isFormValid = formData.name && formData.email && formData.password && formData.phoneNumber && formData.address && /.+@hyderabad\.bits-pilani\.ac\.in$/.test(formData.email);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const registerHandler = async (e) => {
        e.preventDefault();
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL
            const response = await fetch(`${apiUrl}/api/users/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Baby' : '123'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Registration successful!');
                router.push('/');
            } else {
                toast.error(`Registration failed: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    // Function to check if user exists
    const checkUserExists = async (email) => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL
            const response = await fetch(`${apiUrl}/api/users/existsByEmail?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Baby' : '123'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const exists = await response.json();
            setUserExists(exists);

            if (exists) {
                router.push(`/profile/userProfile/${email}`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
 




  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 shadow-2xl mx-4 ">
      <Card className="w-full sm:w-2/3 lg:w-1/2 my-8">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Create an account to continue on the website</p>
        </CardHeader>
        <CardContent>

          <form onSubmit={registerHandler}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={
                    /.+@hyderabad\.bits-pilani\.ac\.in$/.test(formData.email)
                      ? ""
                      : "border-red-500"
                  }
                />
                {!/.+@hyderabad\.bits-pilani\.ac\.in$/.test(formData.email) && (
                  <p className="text-red-500 text-sm">
                    Enter a valid BITS email (e.g., f20212358@hyderabad.bits-pilani.ac.in)
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneNumber">Contact Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Contact Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Hostel name with room no.</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Hostel name-room no."
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button className="mt-4 w-full" disabled={!isFormValid} type="submit">
              Register
            </Button>
          </form>

        </CardContent>
        <CardFooter className="flex flex-col items-center">
        <p className="text-center mb-4 text-sm font-bold">OR</p>
        {session ? (
                        <Button  onClick={() => signOut({ callbackUrl: '/' })} className="mb-4 w-full">
                            Logout
                        </Button>
                    ) : (
                        <Link href="/signin" className="w-full">
                            <Button variant="outline" className="w-full bg-secondary hover:bg-primary hover:text-white">
                                Sign In
                            </Button>
                        </Link>
                    )}
        </CardFooter>
      </Card>
    </div>
  );
}
