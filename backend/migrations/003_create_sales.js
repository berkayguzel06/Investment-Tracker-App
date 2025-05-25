exports.up = function(knex) {
  return knex.schema.createTable('sales', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('asset_id').references('id').inTable('assets').onDelete('CASCADE');
    table.decimal('amount', 20, 8).notNullable();
    table.decimal('sale_price', 20, 8).notNullable();
    table.date('sale_date').notNullable();
    table.enum('currency', ['TRY', 'USD']).notNullable().defaultTo('TRY');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('sales');
}; 