import { Request, Response } from 'express';
import { PortfolioModel } from '../models/Portfolio';
import { CreatePortfolioDto, UpdatePortfolioDto } from '../types';

export class PortfolioController {
  static async getAll(req: Request, res: Response) {
    try {
      const portfolios = await PortfolioModel.getAll();
      res.json(portfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      res.status(500).json({ error: 'Portfolyolar getirilirken hata oluştu' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const portfolio = await PortfolioModel.getById(id);
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolyo bulunamadı' });
      }
      
      res.json(portfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ error: 'Portfolyo getirilirken hata oluştu' });
    }
  }

  static async getWithAssets(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const portfolio = await PortfolioModel.getWithAssets(id);
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolyo bulunamadı' });
      }
      
      res.json(portfolio);
    } catch (error) {
      console.error('Error fetching portfolio with assets:', error);
      res.status(500).json({ error: 'Portfolyo detayları getirilirken hata oluştu' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data: CreatePortfolioDto = req.body;
      
      if (!data.name || data.name.trim() === '') {
        return res.status(400).json({ error: 'Portfolyo adı gereklidir' });
      }
      
      const portfolio = await PortfolioModel.create(data);
      res.status(201).json(portfolio);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      res.status(500).json({ error: 'Portfolyo oluşturulurken hata oluştu' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdatePortfolioDto = req.body;
      
      const portfolio = await PortfolioModel.update(id, data);
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolyo bulunamadı' });
      }
      
      res.json(portfolio);
    } catch (error) {
      console.error('Error updating portfolio:', error);
      res.status(500).json({ error: 'Portfolyo güncellenirken hata oluştu' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await PortfolioModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Portfolyo bulunamadı' });
      }
      
      res.json({ message: 'Portfolyo başarıyla silindi' });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      res.status(500).json({ error: 'Portfolyo silinirken hata oluştu' });
    }
  }
} 