import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController';

const router = Router();

router.get('/', SettingsController.get);
router.put('/', SettingsController.update);
router.put('/exchange-rate', SettingsController.updateExchangeRate);

export default router; 