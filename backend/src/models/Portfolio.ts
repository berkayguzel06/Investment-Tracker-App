import db from '../config/database';
import { CreatePortfolioDto, Portfolio, UpdatePortfolioDto } from '../types';

export class PortfolioModel {
  static async getAll(): Promise<Portfolio[]> {
    return await db('portfolios').select('*').orderBy('created_at', 'desc');
  }

  static async getById(id: string): Promise<Portfolio | undefined> {
    return await db('portfolios').where({ id }).first();
  }

  static async getWithAssets(id: string): Promise<Portfolio | undefined> {
    const portfolio = await db('portfolios').where({ id }).first();
    if (!portfolio) return undefined;

    const assets = await db('assets').where({ portfolio_id: id });
    const sales = await db('sales')
      .join('assets', 'sales.asset_id', 'assets.id')
      .where('assets.portfolio_id', id)
      .select('sales.*');

    return {
      ...portfolio,
      assets,
      sales
    };
  }

  static async create(data: CreatePortfolioDto): Promise<Portfolio> {
    const [portfolio] = await db('portfolios')
      .insert({
        name: data.name,
        description: data.description,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return portfolio;
  }

  static async update(id: string, data: UpdatePortfolioDto): Promise<Portfolio | undefined> {
    const [portfolio] = await db('portfolios')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return portfolio;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedRows = await db('portfolios').where({ id }).del();
    return deletedRows > 0;
  }
} 