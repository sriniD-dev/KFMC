const Base = require('./base').default
const constants = require('../constants')

class InvoicesLineItems extends Base {
    get __schema_name__() { return constants.INVOICESLINEITEMS }
    get schema(){
        return [
            {
                field: 'LineItemID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'lineItemID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'InvoiceID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'invoiceID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'AccountCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountCode',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'Description',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'description',
                sql_data_type: '[nvarchar](max)'
            },
            {
                field: 'DiscountRate',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'discountRate',
                sql_data_type: '[real]'
            },
            {
                field: 'ItemCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'itemCode',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'LineAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'lineAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'Quantity',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'quantity',
                sql_data_type: '[real]'
            },
            {
                field: 'TaxAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'taxAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'TaxType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'taxType',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'UnitAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'unitAmount',
                sql_data_type: '[real]'
            },
            {
                field: "'Item_Code'",
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'item.code',
                sql_data_type: '[nvarchar](max)'
            },
            {
                field: "'Item_ItemID'",
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'item.itemID',
                sql_data_type: '[nvarchar](max)'
            },
            {
                field: "'Item_Name'",
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'item.name',
                sql_data_type: '[nvarchar](max)'
            },
        ]
    }
}
module.exports.default = InvoicesLineItems