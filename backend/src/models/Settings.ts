import db from '../config/database';
import { Settings, UpdateSettingsDto } from '../types';

export class SettingsModel {
  static async get(): Promise<Settings> {
    let settings = await db('settings').first();
    
    if (!settings) {
      // Eğer ayarlar yoksa varsayılan ayarları oluştur
      const [newSettings] = await db('settings')
        .insert({
          currency: 'TRY',
          language: 'tr',
          theme: 'light',
          usd_to_try_rate: 34.50,
          exchange_rate_updated: db.fn.now(),
          display_currency: 'TRY',
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        })
        .returning('*');
      
      settings = newSettings;
    }
    
    return settings;
  }

  static async update(data: UpdateSettingsDto): Promise<Settings> {
    const existingSettings = await this.get();
    
    const [settings] = await db('settings')
      .where({ id: existingSettings.id })
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return settings;
  }

  static async updateExchangeRate(rate: number): Promise<Settings> {
    const existingSettings = await this.get();
    
    const [settings] = await db('settings')
      .where({ id: existingSettings.id })
      .update({
        usd_to_try_rate: rate,
        exchange_rate_updated: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return settings;
  }
} 