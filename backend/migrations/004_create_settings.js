exports.up = function(knex) {
  return knex.schema.createTable('settings', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('currency').defaultTo('TRY');
    table.string('language').defaultTo('tr');
    table.enum('theme', ['light', 'dark']).defaultTo('light');
    table.decimal('usd_to_try_rate', 10, 4).defaultTo(34.50);
    table.timestamp('exchange_rate_updated').defaultTo(knex.fn.now());
    table.enum('display_currency', ['TRY', 'USD']).defaultTo('TRY');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('settings');
}; 