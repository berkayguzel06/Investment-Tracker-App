import { Request, Response } from 'express';
import { SettingsModel } from '../models/Settings';
import { UpdateSettingsDto } from '../types';

export class SettingsController {
  static async get(req: Request, res: Response) {
    try {
      const settings = await SettingsModel.get();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Ayarlar getirilirken hata oluştu' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const data: UpdateSettingsDto = req.body;
      const settings = await SettingsModel.update(data);
      res.json(settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Ayarlar güncellenirken hata oluştu' });
    }
  }

  static async updateExchangeRate(req: Request, res: Response) {
    try {
      const { rate } = req.body;
      
      if (typeof rate !== 'number' || rate <= 0) {
        return res.status(400).json({ error: 'Geçerli bir kur değeri giriniz' });
      }
      
      const settings = await SettingsModel.updateExchangeRate(rate);
      res.json(settings);
    } catch (error) {
      console.error('Error updating exchange rate:', error);
      res.status(500).json({ error: 'Döviz kuru güncellenirken hata oluştu' });
    }
  }
} 