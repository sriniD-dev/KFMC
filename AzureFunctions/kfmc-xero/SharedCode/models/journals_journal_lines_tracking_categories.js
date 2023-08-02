const Base = require('./base').default
const constants = require('../constants')

class JournalsJournalLinesTrackingCategories extends Base{
    get __schema_name__() { return constants.JOURNALSJOURNALLINESTRACKINGCATEGORIES }
    get schema(){
        return [
            {
                field: 'JournalLineID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'journalLineID',
                is_foreign_key: true,
                sql_data_type: '[nvarchar](50)'
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
                field: 'Option',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'option',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'TrackingCategoryID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'trackingCategoryID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'TrackingOptionID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'trackingOptionID',
                sql_data_type: '[nvarchar](50)'
            }
        ]
    }
}
module.exports.default = JournalsJournalLinesTrackingCategories