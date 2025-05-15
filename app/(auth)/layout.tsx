import React,{ReactNode} from 'react'

const AuthLayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='h-full p-[2rem] flex justify-center items-center'>
        {children}
    </div>
  )
}

export default AuthLayout