import db from '../config/database';
import { Asset, CreateAssetDto, UpdateAssetDto } from '../types';

export class AssetModel {
  static async getAll(): Promise<Asset[]> {
    return await db('assets').select('*').orderBy('created_at', 'desc');
  }

  static async getByPortfolioId(portfolioId: string): Promise<Asset[]> {
    return await db('assets')
      .where({ portfolio_id: portfolioId })
      .orderBy('created_at', 'desc');
  }

  static async getById(id: string): Promise<Asset | undefined> {
    return await db('assets').where({ id }).first();
  }

  static async create(data: CreateAssetDto): Promise<Asset> {
    const [asset] = await db('assets')
      .insert({
        portfolio_id: data.portfolio_id,
        name: data.name,
        category: data.category,
        amount: data.amount,
        purchase_price: data.purchase_price,
        purchase_date: data.purchase_date,
        current_price: data.current_price,
        currency: data.currency,
        notes: data.notes,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return asset;
  }

  static async update(id: string, data: UpdateAssetDto): Promise<Asset | undefined> {
    const [asset] = await db('assets')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return asset;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedRows = await db('assets').where({ id }).del();
    return deletedRows > 0;
  }

  static async updateCurrentPrice(id: string, currentPrice: number): Promise<Asset | undefined> {
    const [asset] = await db('assets')
      .where({ id })
      .update({
        current_price: currentPrice,
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return asset;
  }
} 