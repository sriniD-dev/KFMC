const Base = require('./base').default
const constants = require('../constants')

class Tenants extends Base {
    get __schema_name__() { return constants.TENANTS }
    get is_primary_table() { return true }
    get schema(){
        return [
            {
                field: 'UserId',
                type: String,
                default: '',
                not_null: true,
                is_foreign_key: true,
                object_mapper: 'user_id',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'Id',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'id',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'AuthEventId',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'authEventId',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'TenantId',
                type: String,
                default: '',
                not_null: false,
                is_primary_key: true,
                object_mapper: 'tenantId',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'TenantType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'tenantType',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'TenantName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'tenantName',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'CreatedDateUtc',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'createdDateUtc',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'UpdatedDateUtc',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'updatedDateUtc',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'OrgData_OrganisationID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'orgData.organisationID',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'OrgData_Name',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'orgData.name',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'OrgData_LegalName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'orgData.legalName',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'OrgData_PaysTax',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'orgData.paysTax',
                sql_data_type: '[int]'
            },
            {
                field: 'OrgData_OrganisationType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'orgData.organisationType',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'OrgData_BaseCurrency',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'orgData.baseCurrency',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'OrgData_CountryCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'orgData.countryCode',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'OrgData_Timezone',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'orgData.timezone',
                sql_data_type: '[nvarchar](150)'
            },
            {
                field: 'OrgData_CreatedDateUTC',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'orgData.createdDateUTC',
                sql_data_type: '[datetime]'
            },
            {
                field: 'LastSyncDate',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'lastSyncDate',
                sql_data_type: '[datetime]'
            },
            {
                field: 'DbName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'dbName',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'IsActive',
                type: Number,
                default: 1,
                not_null: true,
                object_mapper: 'isActive',
                sql_data_type: '[int]'
            },
        ]
    }
}
module.exports.default = Tenants