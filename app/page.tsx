
import Navbar from '@/sections/navbar/view'
import SidebarMenu from '@/sections/sidebar-menu/view'
import MainContent from '@/sections/main-content/view'
export default async function Home() {

  return (
    <>
      <Navbar />
      <div className='flex mt-5 sm:space-x-4 justify-between'  >

        <SidebarMenu />
        <MainContent />

      </div>
    </>
  )
}
