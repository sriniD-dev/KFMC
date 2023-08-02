const Base = require('./base').default
const constants = require('../constants')

class ContactsAddresses extends Base{
    get __schema_name__() { return constants.CONTACTSADDRESSES }
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
                field: 'AddressLine1',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'addressLine1',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'AddressLine2',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'addressLine2',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'AddressLine3',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'addressLine3',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'AddressLine4',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'addressLine4',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'AddressType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'addressType',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'AttentionTo',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'attentionTo',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'City',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'city',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'Country',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'country',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'PostalCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'postalCode',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'Region',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'region',
                sql_data_type: '[nvarchar](100)'
            },
        ]
    }
}
module.exports.default = ContactsAddresses