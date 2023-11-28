import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import Authprovider from '../components/Authprovider/Authprovider'
// import { ToastContainer , toast } from 'react-toastify';
import { Toaster } from 'react-hot-toast';



const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BITS_bids',
  description: 'Buy n Sell for BITS Hyderabad',
}

export default function RootLayout({ children }) {

 
  return (
    <html lang="en">
      <body className={inter.className}>
        <Authprovider>
          {/* <Navbar/> */}
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
           </ThemeProvider>
          </Authprovider>
          {/* <ToastContainer
position="bottom-center"
autoClose={1900}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/> Add the ToastContainer here */}
<Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toastOptions={{
    // Define default options
    className: '',
    duration: 5000,
    style: {
      background: '#363636',
      color: '#fff',
    },

    // Default options for specific types
    success: {
      duration: 3000,
      theme: {
        primary: 'green',
        secondary: 'black',
      },
    },
    error: {
      duration: 3000,
      theme: {
        primary: 'red',
        secondary: 'black',
      },
    },
  }}
/>
          </body>
    </html>
  )
}
