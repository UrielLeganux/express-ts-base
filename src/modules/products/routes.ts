import {Router, Request, Response} from 'express';
import {productController} from "./controller";
const router = Router();

router.get(`/getAllProducts`, productController.getAllProducts);

router.post(`/createOne`, productController.createOneProduct);

router.post('/addnewproduct', productController.addnewproduct);


export default router;
