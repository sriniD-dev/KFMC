const Base = require('./base').default
const constants = require('../constants')

class Invoices extends Base {
    get __schema_name__() { return constants.INVOICES }
    get schema(){
        return [
            {
                field: 'InvoiceID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'invoiceID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'AmountCredited',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'amountCredited',
                sql_data_type: '[real]'
            },
            {
                field: 'AmountDue',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'amountDue',
                sql_data_type: '[real]'
            },
            {
                field: 'AmountPaid',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'amountPaid',
                sql_data_type: '[real]'
            },
            {
                field: 'BrandingThemeID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'brandingThemeID',
                sql_data_type: '[nvarchar](50)'
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
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'CurrencyRate',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'currencyRate',
                sql_data_type: '[real]'
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
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'DueDate',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'dueDate',
                sql_data_type: '[datetime]'
            },
            {
                field: 'DueDateString',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'dueDate',
                date_to_string: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'FullyPaidOnDate',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'fullyPaidOnDate',
                sql_data_type: '[datetime]'
            },
            {
                field: 'PlannedPaymentDate',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'plannedPaymentDate',
                sql_data_type: '[datetime]'
            },
            {
                field: 'PlannedPaymentDateString',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'plannedPaymentDate',
                date_to_string: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'RepeatingInvoiceID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'repeatingInvoiceID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'SentToContact',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'sentToContact',
                boolean_to_string: true,
                sql_data_type: '[nvarchar](50)'
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
                field: 'HasErrors',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'hasErrors',
                sql_data_type: '[int]'
            },
            {
                field: 'InvoiceNumber',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'invoiceNumber',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'IsDiscounted',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'isDiscounted',
                sql_data_type: '[int]'
            },
            {
                field: 'LineAmountTypes',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'lineAmountTypes',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'Reference',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'reference',
                sql_data_type: '[nvarchar](max)'
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
                field: 'type',
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
            },
            {
                field: 'Contact_ContactNumber',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'contact.contactNumber',
                sql_data_type: '[nvarchar](150)'
            }
        ]
    }
}
module.exports.default = Invoices