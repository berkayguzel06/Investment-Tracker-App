exports.up = function(knex) {
  return knex.schema.createTable('assets', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('portfolio_id').references('id').inTable('portfolios').onDelete('CASCADE');
    table.string('name').notNullable();
    table.enum('category', ['fon', 'hisse', 'doviz', 'kripto', 'kiymetli_maden']).notNullable();
    table.decimal('amount', 20, 8).notNullable();
    table.decimal('purchase_price', 20, 8).notNullable();
    table.date('purchase_date').notNullable();
    table.decimal('current_price', 20, 8);
    table.enum('currency', ['TRY', 'USD']).notNullable().defaultTo('TRY');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('assets');
}; 