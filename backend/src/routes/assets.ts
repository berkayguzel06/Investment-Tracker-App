import { Router } from 'express';
import { AssetController } from '../controllers/assetController';

const router = Router();

router.get('/', AssetController.getAll);
router.get('/portfolio/:portfolioId', AssetController.getByPortfolio);
router.get('/:id', AssetController.getById);
router.post('/', AssetController.create);
router.put('/:id', AssetController.update);
router.put('/:id/price', AssetController.updateCurrentPrice);
router.delete('/:id', AssetController.delete);

export default router; 