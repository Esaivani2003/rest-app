import React from 'react'
import FoodOrderPage from '@/components/OrderBill'
import Layout from '@/components/layout'

const index = () => {
  return (
    <Layout>
    <div className=' pt-6 h-full flex bg-gray-500/15 justify-center items-center'>
        <FoodOrderPage/>
    </div>
    </Layout>
  )
}

export default index