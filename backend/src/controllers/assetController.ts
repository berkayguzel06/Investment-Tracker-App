import { Request, Response } from 'express';
import { AssetModel } from '../models/Asset';
import { CreateAssetDto, UpdateAssetDto } from '../types';

export class AssetController {
  static async getAll(req: Request, res: Response) {
    try {
      const assets = await AssetModel.getAll();
      res.json(assets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      res.status(500).json({ error: 'Varlıklar getirilirken hata oluştu' });
    }
  }

  static async getByPortfolio(req: Request, res: Response) {
    try {
      const { portfolioId } = req.params;
      const assets = await AssetModel.getByPortfolioId(portfolioId);
      res.json(assets);
    } catch (error) {
      console.error('Error fetching assets by portfolio:', error);
      res.status(500).json({ error: 'Portfolyo varlıkları getirilirken hata oluştu' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const asset = await AssetModel.getById(id);
      
      if (!asset) {
        return res.status(404).json({ error: 'Varlık bulunamadı' });
      }
      
      res.json(asset);
    } catch (error) {
      console.error('Error fetching asset:', error);
      res.status(500).json({ error: 'Varlık getirilirken hata oluştu' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data: CreateAssetDto = req.body;
      
      // Basit validasyon
      if (!data.name || !data.category || !data.amount || !data.purchase_price || !data.purchase_date) {
        return res.status(400).json({ error: 'Gerekli alanlar eksik' });
      }
      
      const asset = await AssetModel.create(data);
      res.status(201).json(asset);
    } catch (error) {
      console.error('Error creating asset:', error);
      res.status(500).json({ error: 'Varlık oluşturulurken hata oluştu' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateAssetDto = req.body;
      
      const asset = await AssetModel.update(id, data);
      
      if (!asset) {
        return res.status(404).json({ error: 'Varlık bulunamadı' });
      }
      
      res.json(asset);
    } catch (error) {
      console.error('Error updating asset:', error);
      res.status(500).json({ error: 'Varlık güncellenirken hata oluştu' });
    }
  }

  static async updateCurrentPrice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { currentPrice } = req.body;
      
      if (typeof currentPrice !== 'number') {
        return res.status(400).json({ error: 'Geçerli bir fiyat giriniz' });
      }
      
      const asset = await AssetModel.updateCurrentPrice(id, currentPrice);
      
      if (!asset) {
        return res.status(404).json({ error: 'Varlık bulunamadı' });
      }
      
      res.json(asset);
    } catch (error) {
      console.error('Error updating asset price:', error);
      res.status(500).json({ error: 'Varlık fiyatı güncellenirken hata oluştu' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await AssetModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Varlık bulunamadı' });
      }
      
      res.json({ message: 'Varlık başarıyla silindi' });
    } catch (error) {
      console.error('Error deleting asset:', error);
      res.status(500).json({ error: 'Varlık silinirken hata oluştu' });
    }
  }
} 