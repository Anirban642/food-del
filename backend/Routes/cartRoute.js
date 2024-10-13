import express from 'express'
import { addToCart,removeFromCart,getCart } from '../Controllers/cardController.js'
import authMiddleWare from '../Middleware/auth.js';

const cartRouter = express.Router(); 

cartRouter.post("/add",authMiddleWare,addToCart)
cartRouter.post("/remove",authMiddleWare,removeFromCart)
cartRouter.post("/get",authMiddleWare,getCart)

export default cartRouter;