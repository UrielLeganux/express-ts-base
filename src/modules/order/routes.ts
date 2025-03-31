import {Router, Request, Response} from 'express';
import {orderController} from "./controller";
const router = Router();


router.post("/create",orderController.create );

export default router;
