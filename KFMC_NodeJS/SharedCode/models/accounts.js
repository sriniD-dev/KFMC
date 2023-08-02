const Base = require('./base').default
const constants = require('../constants')

class Accounts extends Base {
    get __schema_name__() { return constants.ACCOUNTS}
    get schema(){
        return [
            {
                field: 'AccountID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountID',
                is_primary_key: true,
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
                field: 'SystemAccount',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'systemAccount',
            sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'AddToWatchlist',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'addToWatchlist',
                sql_data_type: '[int]'
            },
            {
                field: 'BankAccountNumber',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'bankAccountNumber',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BankAccountType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'bankAccountType',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'Class',
                type: String,
                default: '',
                not_null: false,
                object_mapper: '_class',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'Code',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'code',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'CurrencyCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'currencyCode',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'EnablePaymentsToAccount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'enablePaymentsToAccount',
                sql_data_type: '[int]'
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
                field: 'Name',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'name',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'ReportingCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'reportingCode',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'ReportingCodeName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'reportingCodeName',
                sql_data_type: '[nvarchar](400)'
            },
            {
                field: 'ShowInExpenseClaims',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'showInExpenseClaims',
                sql_data_type: '[int]'
            },
            {
                field: 'Status',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'status',
                sql_data_type: '[nvarchar](50)'
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
                field: 'Type',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'type',
                sql_data_type: '[nvarchar](50)'
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
module.exports.default = Accounts