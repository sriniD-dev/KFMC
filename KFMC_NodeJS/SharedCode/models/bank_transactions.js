const Base = require('./base').default
const constants = require('../constants')

class BankTransactions extends Base {
    get __schema_name__() { return constants.BANKTRANSACTIONS }
    get schema(){
        return [
            {
                field: 'BankTransactionID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'bankTransactionID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BankAccount_AccountID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'bankAccount.accountID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BankAccount_Code',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'bankAccount.code',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BankAccount_Name',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'bankAccount.name',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'BatchPayment_Account_AccountID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPayment.account.accountID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BatchPayment_BatchPaymentID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPayment.batchPaymentID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BatchPayment_Date',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPayment.date',
                date_to_string: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BatchPayment_DateString',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPayment.date',
                date_to_string: true,
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'BatchPayment_IsReconciled',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPayment.isReconciled',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'BatchPayment_Status',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPayment.status',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'BatchPayment_TotalAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'batchPayment.totalAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'BatchPayment_Type',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPayment.type',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'BatchPayment_UpdatedDateUTC',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPayment.updatedDateUTC',
                date_to_string: true,
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'Contact_ContactID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'contact.contactID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'Contact_HasValidationErrors',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'contact.hasValidationErrors',
                sql_data_type: '[int]'
            },
            {
                field: 'Contact_Name',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'contact.name',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'CurrencyCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'currencyCode',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'CurrencyRate',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'currencyRate',
                number_to_string: true,
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'Date',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'date',
                sql_data_type: '[datetime]'
            },
            {
                field: 'DateString',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'date',
                date_to_string: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'ExternalLinkProviderName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'externalLinkProviderName',
                sql_data_type: '[nvarchar](max)'
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
                field: 'IsReconciled',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'isReconciled',
                sql_data_type: '[int]'
            },
            {
                field: 'LineAmountTypes',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'lineAmountTypes',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'OverpaymentID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'overpaymentID',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'Reference',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'reference',
                sql_data_type: '[nvarchar](100)'
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
                field: 'SubTotal',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'subTotal',
                sql_data_type: '[real]'
            },
            {
                field: 'Total',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'total',
                sql_data_type: '[real]'
            },
            {
                field: 'TotalTax',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'totalTax',
                sql_data_type: '[real]'
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
            {
                field: 'Url',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'url',
                sql_data_type: '[nvarchar](max)'
            }
        ]
    }
}
module.exports.default = BankTransactions