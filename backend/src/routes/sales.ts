import { Router } from 'express';
import { SaleController } from '../controllers/saleController';

const router = Router();

router.get('/', SaleController.getAll);
router.get('/asset/:assetId', SaleController.getByAsset);
router.get('/portfolio/:portfolioId', SaleController.getByPortfolio);
router.get('/:id', SaleController.getById);
router.post('/', SaleController.create);
router.delete('/:id', SaleController.delete);

export default router; 