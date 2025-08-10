import express from 'express'
import authMiddleWare from '../Middleware/auth.js'
import { placeOrder, verifyOrder ,userOrders, listOrders, updateStatus } from '../Controllers/orderController.js'

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleWare,placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/userOrders",authMiddleWare,userOrders)
orderRouter.get("/list",listOrders)
orderRouter.post("/status",updateStatus)

export default orderRouter;