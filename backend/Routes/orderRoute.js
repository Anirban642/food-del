import express from 'express'
import authMiddleWare from '../Middleware/auth.js'
import { placeOrder } from '../Controllers/orderController.js'

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleWare,placeOrder);


export default orderRouter;