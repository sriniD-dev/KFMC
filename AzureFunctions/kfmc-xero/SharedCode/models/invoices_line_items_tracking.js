const Base = require('./base').default
const constants = require('../constants')

class InvoicesLineItemsTracking extends Base {
    get __schema_name__() { return constants.INVOICESLINEITEMSTRACKING }
    get schema(){
        return [
            {
                field: 'TrackingCategoryID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'trackingCategoryID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'LineItemID',
                type: String,
                default: '',
                not_null: true,
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
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'option',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'option',
                sql_data_type: '[nvarchar](max)'
            }
        ]
    }
}
module.exports.default = InvoicesLineItemsTracking