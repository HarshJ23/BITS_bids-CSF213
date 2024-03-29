'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"

import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect  , useState} from 'react'
import { toast } from 'react-hot-toast';
// import { redirect } from 'next/navigation';
import DataTable from '@/components/shared/DataTable'
import { TabularSkeletonLoader } from '@/components/shared/TabularSkeletonLoader'
import Navbar from '@/components/shared/Navbar'
import { ProfileDialog } from '@/components/shared/ProfileDialog'



export default function page({params}) {

  const router = useRouter();
  const { data: session } = useSession();
  const email = decodeURIComponent(params.id);
  const [userData, setUserData] = useState({
    id: null,
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    moneyLeft: 0,
    itemsPurchased: [], 
    // id store hoga of pdt
    itemsListed: [],
    //    // id store hoga of pdt
    visibleTo: [],
    itemsSold: [],
    //past listings.
    currentBids: [],
    pastBids: '',
    moneySpent: 0,
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const firstName = userData.name ? userData.name.split(' ')[0] : '';
  
  //state for array of listings.
  const [userListings , setUserListings] = useState([]);
  const soldItemsofUser = userListings.filter(item => item.isSold === 1);
  const unsoldItemsofUser = userListings.filter(item => item.isSold === 0);

  //for user purchases
  const [userPurchases , setUserPurchases] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

//   hook taken from /register/page.js
  useEffect(() => {
    if (!session) {
      toast.error('You must be signed in to access the register page.')
      router.push('/signin');
      // router.replace('/signin');
    }
}, [session]);

//to fetch current user details.
useEffect(()=>{
    const getUser = async ()=>{
        try {
            const response = await fetch(`${apiUrl}/api/users/getUserFromEmail?email=${email}` , {
                method : 'GET',
                headers:{
                    'Baby' : '123',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const getUserData = await response.json();
              setUserData(getUserData);
              console.log(userData);
        } catch (error) {
            console.error('Error fetching data:', error)
      }
    }
getUser();
},[email]);

//fetch litings of user on his profile
useEffect(()=>{

  const getUserListings = async ()=>{
    setIsLoading(true); 
      try {
        const response = await fetch(`${apiUrl}/api/product/getProductsOfUserFromEmail?email=${email}`,{
          method : 'GET',
          headers : {
            'Baby' : '123',
          }
        });
        if(!response.ok){
          throw new Error('Error occured');
        }
        const listings = await response.json();
        setUserListings(listings);
        // console.log(userListings);
      } catch (error) {
        console.error('Error while fetching data',error);
      }
      setIsLoading(false); 
  }
getUserListings();
},[email]);

//to log the userListings from the state.
useEffect(()=>{
  console.log(userListings);
},[userListings]);


//get purchases of the customer.
useEffect(()=>{

  const getUserPurchases = async ()=>{
    setIsLoading(true); 
      try {
        const response = await fetch(`${apiUrl}/api/product/getItemsPurchasedOfUser?email=${email}`,{
          method : 'GET',
          headers : {
            'Baby' : '123',
          }
        });
        if(!response.ok){
          throw new Error('Error occured');
        }
        const purchases = await response.json();
        setUserPurchases(purchases);
        // console.log(userListings);
      } catch (error) {
        console.error('Error while fetching data',error);
      }
      setIsLoading(false); 
  }
  getUserPurchases ();
},[email]);


// const handleSearch = (searchTerm) => {
//   searchTerm = searchTerm.toLowerCase();
//   const filteredProducts = allProducts.filter(product =>
//     product.name.toLowerCase().includes(searchTerm)
//   );

//   // Display these products as per your UI design
//   console.log(filteredProducts); // Replace this with your UI rendering logic
// };


return (
<>
<Navbar/>
<div className='mt-8 mx-4 flex flex-row justify-between items-center z-0'>

        <div>
        <p className='text-xl font-semibold'>My profile</p>
        <h1 className='font-extrabold text-2xl lg:text-4xl tracking-tight '>Welcome {firstName} !</h1>
        </div>

        {/* <div>
        <Input type="email" placeholder="Email" value={userData.email} className='w-72 shadow-xl border-gray-400 ' disabled />
        </div> */}
        {userData.email && (
 <ProfileDialog userData={userData}/>
    )}
        
        </div>
     
        {userListings && userListings.length > 0 ? (
    <>
<div className='mb-10 pb-10'>

    {/* unsold items table */}
        <div className='mt-8 mx-4'>
          {unsoldItemsofUser && unsoldItemsofUser.length>0 ? (<div>
                <h1 className='font-extrabold text-2xl lg:text-4xl tracking-tight '>Current items</h1>
                {isLoading ? (
                  <TabularSkeletonLoader />
                  ) : (
                    <DataTable data={unsoldItemsofUser} buyerSellerName="Buyer" />
                    )}
            </div>):
          (  <div className= 'flex justify-center items-center  h-[30vh]'>
            <h1 className='font-extrabold text-2xl tracking-tight '>sell new items</h1>
          </div>
            
            )}
        </div>

 {/* Sold items table */}
        <div className='mt-8 mx-4'>
          {soldItemsofUser && soldItemsofUser.length>0 ? (<div>
                <h1 className='font-extrabold text-2xl lg:text-4xl tracking-tight '>Items Sold by You</h1>
                {isLoading ? (
                  <TabularSkeletonLoader />
                  ) : (
                    <DataTable data={soldItemsofUser} buyerSellerName="Buyer" />
                    )}
            </div>):
          (  <div className= 'flex justify-center items-center  h-[30vh]'>
            <h1 className='font-extrabold text-2xl tracking-tight '>None of your items sold yet.</h1>
          </div>
            
            )}
        </div>

 {/* items purchases table */}
 <div className='mt-8 mx-4'>
          {userPurchases  && userPurchases.length>0 ? (<div>
                <h1 className='font-extrabold text-2xl lg:text-4xl tracking-tight'>Items Purchased by You</h1>
                {isLoading ? (
                  <TabularSkeletonLoader />
                  ) : (
                    <DataTable data={userPurchases} buyerSellerName="Seller" />
                    )}
            </div>):
          (  <div className= 'flex justify-center items-center  h-[30vh]'>
            <h1 className='font-extrabold text-2xl tracking-tight '>No purchases yet.</h1>
          </div>
            
            )}
        </div>
            </div>

    </>
) : (
    <div className= 'flex justify-center items-center  h-[50vh]'>
        <h1 className='font-extrabold text-4xl tracking-tight '>No items to be shown</h1>
    </div>
)}

        
{/* <div className='flex flex-row mx-4 gap-4 my-4'>

<Link href='/listings/createlisting'><Button>Create Listing</Button></Link>
<Link href={`/bid/userbids/${userData.email}`}><Button>My All Bids</Button></Link>
<Button 
  onClick={() => {
    signOut({ callbackUrl: '/' });
    toast.success("Signed out");
  }} 
  variant="destructive">
  Logout
</Button>


</div> */}

<div className="fixed inset-x-0 bottom-0 bg-white z-50 p-3 mb-3 flex justify-center gap-4 items-center shadow-2xl shadow-gray-400 rounded-lg mx-4 transition hover:cursor-pointer hover:scale-95 ease-in-out">
        <Link href='/listings/createlisting'>
          <Button >
            Create Listing
          </Button>
        </Link>
        <Link href={`/bid/userbids/${userData.email}`}>
          <Button className="">
            My All Bids
          </Button>
        </Link>
        <Button 
          onClick={() => {
            signOut({ callbackUrl: '/' });
            toast.success("Signed out");
          }} 
         variant="destructive"
        >
          Logout
        </Button>
      </div>
</>
  )
}
