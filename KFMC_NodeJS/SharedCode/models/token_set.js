const Base = require('./base').default
const moment = require('moment')
const constants = require('../constants')

class TokenSet extends Base {
    get __schema_name__() { return constants.TOKENSET }
    get is_primary_table() { return true }
    get schema(){
        return [
            {
                field: 'UserId',
                type: String,
                default: '',
                not_null: true,
                is_primary_key: true,
                object_mapper: 'user_id',
                sql_data_type: '[nvarchar](200)'
            },
            {
                field: 'IdToken',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'id_token',
                sql_data_type: '[nvarchar](max)'
            },
            {
                field: 'AccessToken',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'access_token',
                sql_data_type: '[nvarchar](max)'
            },
            {
                field: 'RefreshToken',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'refresh_token',
                sql_data_type: '[nvarchar](max)'
            },
            {
                field: 'Scope',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'scope',
                sql_data_type: '[nvarchar](200)'
            },
            {
                field: 'ExpiresIn',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'expires_in',
                sql_data_type: '[int]'
            },
            {
                field: 'TokenType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'token_type',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'UpdatedDateUTC',
                type: Date,
                default: () => new Date(),
                not_null: true,
                sql_data_type: '[datetime]'
            }
        ]
    }
    get tokenset(){
        if(!this.UserId) return null
        return {
            id_token: this.IdToken,
            access_token: this.AccessToken,
            refresh_token: this.RefreshToken,
            scope: this.Scope,
            expires_in: this.ExpiresIn,
            token_type: this.TokenType
        }
    }
    get is_expired(){
        if (this.UpdatedDateUTC && this.ExpiresIn) return moment.utc() > moment.utc(this.UpdatedDateUTC).seconds(this.ExpiresIn)
        return true
    }
}
module.exports.default = TokenSet