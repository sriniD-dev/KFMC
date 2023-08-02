const Base = require('./base').default
const constants = require('../constants')

class TrackingCategoriesOptions extends Base {
    get __schema_name__() { return constants.TRACKINGCATEGORIESOPTIONS }
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
                field: 'TrackingOptionID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'trackingOptionID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'HasValidationErrors',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'hasValidationErrors',
                sql_data_type: '[int]'
            },
            {
                field: 'IsActive',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'isActive',
                sql_data_type: '[int]'
            },
            {
                field: 'IsArchived',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'isArchived',
                sql_data_type: '[int]'
            },
            {
                field: 'IsDeleted',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'isDeleted',
                sql_data_type: '[int]'
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
                field: 'Status',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'status',
                sql_data_type: '[nvarchar](100)'
            }
        ]
    }
}
module.exports.default = TrackingCategoriesOptions