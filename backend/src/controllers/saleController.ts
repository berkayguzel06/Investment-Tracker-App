import { Request, Response } from 'express';
import { SaleModel } from '../models/Sale';
import { CreateSaleDto } from '../types';

export class SaleController {
  static async getAll(req: Request, res: Response) {
    try {
      const sales = await SaleModel.getAll();
      res.json(sales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ error: 'Satışlar getirilirken hata oluştu' });
    }
  }

  static async getByAsset(req: Request, res: Response) {
    try {
      const { assetId } = req.params;
      const sales = await SaleModel.getByAssetId(assetId);
      res.json(sales);
    } catch (error) {
      console.error('Error fetching sales by asset:', error);
      res.status(500).json({ error: 'Varlık satışları getirilirken hata oluştu' });
    }
  }

  static async getByPortfolio(req: Request, res: Response) {
    try {
      const { portfolioId } = req.params;
      const sales = await SaleModel.getByPortfolioId(portfolioId);
      res.json(sales);
    } catch (error) {
      console.error('Error fetching sales by portfolio:', error);
      res.status(500).json({ error: 'Portfolyo satışları getirilirken hata oluştu' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sale = await SaleModel.getById(id);
      
      if (!sale) {
        return res.status(404).json({ error: 'Satış bulunamadı' });
      }
      
      res.json(sale);
    } catch (error) {
      console.error('Error fetching sale:', error);
      res.status(500).json({ error: 'Satış getirilirken hata oluştu' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data: CreateSaleDto = req.body;
      
      // Basit validasyon
      if (!data.asset_id || !data.amount || !data.sale_price || !data.sale_date) {
        return res.status(400).json({ error: 'Gerekli alanlar eksik' });
      }
      
      const sale = await SaleModel.create(data);
      res.status(201).json(sale);
    } catch (error) {
      console.error('Error creating sale:', error);
      res.status(500).json({ error: 'Satış oluşturulurken hata oluştu' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await SaleModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Satış bulunamadı' });
      }
      
      res.json({ message: 'Satış başarıyla silindi' });
    } catch (error) {
      console.error('Error deleting sale:', error);
      res.status(500).json({ error: 'Satış silinirken hata oluştu' });
    }
  }
} 