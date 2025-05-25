import db from '../config/database';
import { CreateSaleDto, Sale } from '../types';

export class SaleModel {
  static async getAll(): Promise<Sale[]> {
    return await db('sales').select('*').orderBy('created_at', 'desc');
  }

  static async getByAssetId(assetId: string): Promise<Sale[]> {
    return await db('sales')
      .where({ asset_id: assetId })
      .orderBy('sale_date', 'desc');
  }

  static async getByPortfolioId(portfolioId: string): Promise<Sale[]> {
    return await db('sales')
      .join('assets', 'sales.asset_id', 'assets.id')
      .where('assets.portfolio_id', portfolioId)
      .select('sales.*')
      .orderBy('sales.sale_date', 'desc');
  }

  static async getById(id: string): Promise<Sale | undefined> {
    return await db('sales').where({ id }).first();
  }

  static async create(data: CreateSaleDto): Promise<Sale> {
    const [sale] = await db('sales')
      .insert({
        asset_id: data.asset_id,
        amount: data.amount,
        sale_price: data.sale_price,
        sale_date: data.sale_date,
        currency: data.currency,
        notes: data.notes,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return sale;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedRows = await db('sales').where({ id }).del();
    return deletedRows > 0;
  }
} 