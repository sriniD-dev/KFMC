const Base = require('./base').default
const constants = require('../constants')

class Contacts extends Base {
    get __schema_name__() { return constants.CONTACTS }
    get schema(){
        return [
            {
                field: 'ContactID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'contactID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'LastName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'lastName',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'FirstName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'firstName',
                sql_data_type: '[nvarchar](255)'
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
                field: 'ContactNumber',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'contactNumber',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'AccountNumber',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountNumber',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'AccountsPayableTaxType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountsPayableTaxType',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'AccountsReceivableTaxType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountsReceivableTaxType',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'Balances_AccountsPayable_Outstanding',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'balances.accountsPayable.outstanding',
                sql_data_type: '[real]'
            },
            {
                field: 'Balances_AccountsPayable_Overdue',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'balances.accountsPayable.overdue',
                sql_data_type: '[real]'
            },
            {
                field: 'Balances_AccountsReceivable_Outstanding',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'balances.accountsReceivable.outstanding',
                sql_data_type: '[real]'
            },
            {
                field: 'Balances_AccountsReceivable_Overdue',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'balances.accountsReceivable.overdue',
                sql_data_type: '[real]'
            },
            {
                field: 'BankAccountDetails',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'bankAccountDetails',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'ContactStatus',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'contactStatus',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'DefaultCurrency',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'defaultCurrency',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'EmailAddress',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'emailAddress',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'HasAttachments',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'hasAttachments',
                sql_data_type: '[int]'
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
                field: 'IsCustomer',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'isCustomer',
                sql_data_type: '[int]'
            },
            {
                field: 'IsSupplier',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'isSupplier',
                sql_data_type: '[int]'
            },
            {
                field: 'SkypeUserName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'skypeUserName',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'TaxNumber',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'taxNumber',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'UpdatedDateUTC',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'updatedDateUTC',
                max_value_field: true,
                sql_data_type: '[datetime]'
            },
        ]
    }
}
module.exports.default = Contacts