import { error } from "node:console"
import { prisma } from "../lib/prisma"
import { UserRole } from "../Middleare/auth"
import { json } from "better-auth"

async function seedAdmin(){

try{

    const adminData = {
        name : "Admin saheb",
        email:"admin@gmail.com",
        role:UserRole.ADMIN,
        password:"admin12345"
    }

    const existingUser = await prisma.user.findUnique({


        where:{
            email : adminData.email
        }
    })

    if(existingUser){
        throw new Error("User already exist, try login with another email")
    }
    else{
        const adminSignUp = await fetch("http://localhost:3000/api/auth/sign-up/email",{
            method:"POST",
            headers :{
                'Content-Type' : "application/json",
                'Origin': 'http://localhost:4000'
            },
            body : JSON.stringify(adminData)
        })

        console.log(adminSignUp)
        const errorData = await adminSignUp.json();
      
    }

}
catch(error){
    console.error(error)
}

}

seedAdmin()