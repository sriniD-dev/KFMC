const Base = require('./base').default
const constants = require('../constants')

class TrackingCategories extends Base {
    get __schema_name__() { return constants.TRACKINGCATEGORIES }
    get schema(){
        return [
            {
                field: 'Name',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'name',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'Status',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'status',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'TrackingCategoryID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'trackingCategoryID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            }
        ]
    }
}
module.exports.default = TrackingCategories