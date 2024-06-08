import React from 'react'
import login from "../assets/login.jpg"
import { Image } from 'react-bootstrap'

const Login = () => {
  return (
    <div style={{display:"flex"}}>
    <Image src={login} width={"50%"}  style={{display:"flex",alignItems:"center"}} />
    <div >
    <h1 > Chat it </h1>
    
    </div>
    </div>
  )
}

export default Login