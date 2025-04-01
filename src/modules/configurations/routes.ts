import { Router } from 'express';
import { ConfigurationController } from './controller';

const router = Router();

router.post("/createConfiguration", ConfigurationController.createConfiguration);


export default router;
