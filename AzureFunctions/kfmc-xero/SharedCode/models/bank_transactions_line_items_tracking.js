const Base = require('./base').default
const constants = require('../constants')

class BankTransactionsLineItemsTracking extends Base{
    get __schema_name__() { return constants.BANKTRANSACTIONSLINEITEMSTRACKING }
    get schema(){
        return [
            {
                field: 'LineItemID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'lineItemID',
                sql_data_type: '[nvarchar](50)',
                is_primary_key: true,
            },
            {
                field: 'Name',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'name',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'Option',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'option',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'TrackingCategoryID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'trackingCategoryID',
                sql_data_type: '[nvarchar](50)'
            }
        ]
    }
}
module.exports.default = BankTransactionsLineItemsTracking