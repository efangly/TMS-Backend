import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import prisma from "../configs/prisma.config";
import bcrypt from "bcrypt";
import { users } from "@prisma/client";

interface userlogin {
  username: string,
  password: string
}

const register = async (req: Request, res: Response) => {
  const params: users = req.body;
  const saltRounds = 10;
  bcrypt.hash(params.user_password, saltRounds, async (err, hash) => {
    const value = {
      hos_id: params.hos_id,
      user_name: params.user_name,
      user_password: hash,
      display_name: params.display_name
    }
    await prisma.users.create({
      data: value
    }).then((result) => {
      res.status(200).json({ 
        status: 200,
        msg: "Create Suscess!!" 
      });
    }).catch((err) => {
      res.status(400).json({ error: err });
    });
  });
};

const checkLogin = async (req: Request, res: Response) => {
  const { username, password }: userlogin = req.body;
  await prisma.users.findUnique({
    where: { user_name : username }
  }).then( async (result) => {
    if(result){
      const match = await bcrypt.compare(password, result.user_password);
      if(match){
        const userid: number = result.user_id;
        const username: string = result.user_name;
        const displayname: string | null = result.display_name;
        const token: string = sign({ userid,username,displayname }, String(process.env.JWT_SECRET), { expiresIn:'1d' });
        return res.status(200).json({ token });
      }else{
        return res.status(400).json({ error:"รหัสผ่านไม่ถูกต้อง" })
      }
    }
    else{
      return res.status(400).json({ error:"ชื่อผู้ใช้ไม่ถูกต้อง" })
    }
  }).catch((err) => {
    res.status(400).json({ 
      msg: "ไม่สามารถเชื่อม Database ได้" ,
      error: err
    });
  });
};

const requireLogin = expressjwt({
  secret: String(process.env.JWT_SECRET),
  algorithms: ["HS256"]
});

export {
  checkLogin,
  register,
  requireLogin
};