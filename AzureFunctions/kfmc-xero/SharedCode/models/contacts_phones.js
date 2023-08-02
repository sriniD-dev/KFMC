const Base = require('./base').default
const constants = require('../constants')

class ContactsPhones extends Base{
    get __schema_name__() { return constants.CONTACTSPHONES }
    get schema(){
        return [
            {
                field: 'ContactID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'contactID',
                is_foreign_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'PhoneAreaCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'phoneAreaCode',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'PhoneCountryCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'phoneCountryCode',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'PhoneNumber',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'phoneNumber',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'PhoneType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'phoneType',
                sql_data_type: '[nvarchar](100)'
            }
        ]
    }
}
module.exports.default = ContactsPhones