import Navbar from "@/sections/navbar/view";

export default async function Layout({ children }: {children: React.ReactNode}) {
  
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}