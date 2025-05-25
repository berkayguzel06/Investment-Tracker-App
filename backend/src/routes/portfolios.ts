import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolioController';

const router = Router();

router.get('/', PortfolioController.getAll);
router.get('/:id', PortfolioController.getById);
router.get('/:id/details', PortfolioController.getWithAssets);
router.post('/', PortfolioController.create);
router.put('/:id', PortfolioController.update);
router.delete('/:id', PortfolioController.delete);

export default router;