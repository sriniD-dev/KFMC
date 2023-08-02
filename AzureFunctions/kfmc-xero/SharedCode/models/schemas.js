const constants = require('../constants')

const Accounts = require('./accounts').default
const BankTransactionsLineItemsTracking = require('./bank_transactions_line_items_tracking').default
const BankTransactionsLineItems = require('./bank_transactions_line_items').default
const BankTransactions = require('./bank_transactions').default
const ContactsAddresses = require('./contacts_addresses').default
const ContactsPhones = require('./contacts_phones').default
const Contacts = require('./contacts').default
const InvoicesCreditNotes = require('./invoices_credit_notes').default
const InvoicesLineItemsTracking = require('./invoices_line_items_tracking').default
const InvoicesLineItems = require('./invoices_line_items').default
const InvoicesOverpayments = require('./invoices_overpayments').default
const InvoicesPayments = require('./invoices_payments').default
const Invoices = require('./invoices').default
const JournalsJournalLinesTrackingCategories = require('./journals_journal_lines_tracking_categories').default
const JournalsJournalLines = require('./journals_journal_lines').default
const Journals = require('./journals').default
const LinkedTransactions = require('./linked_transactions').default
const TrackingCategoriesOptions = require('./tracking_categories_options').default
const TrackingCategories = require('./tracking_categories').default
const TokenSet = require('./token_set').default
const Tenants = require('./tenants').default
const Migrations = require('./migrations').default


module.exports[constants.ACCOUNTS] = Accounts
module.exports[constants.BANKTRANSACTIONSLINEITEMSTRACKING] = BankTransactionsLineItemsTracking
module.exports[constants.BANKTRANSACTIONSLINEITEMS] = BankTransactionsLineItems
module.exports[constants.BANKTRANSACTIONS] = BankTransactions
module.exports[constants.CONTACTS] = Contacts
module.exports[constants.CONTACTSADDRESSES] = ContactsAddresses
module.exports[constants.CONTACTSPHONES] = ContactsPhones
module.exports[constants.INVOICESCREDITNOTES] = InvoicesCreditNotes
module.exports[constants.INVOICESLINEITEMSTRACKING] = InvoicesLineItemsTracking
module.exports[constants.INVOICESLINEITEMS] = InvoicesLineItems
module.exports[constants.INVOICESOVERPAYMENTS] = InvoicesOverpayments
module.exports[constants.INVOICESPAYMENTS] = InvoicesPayments
module.exports[constants.INVOICES] = Invoices
module.exports[constants.JOURNALS] = Journals
module.exports[constants.JOURNALSJOURNALLINES] = JournalsJournalLines
module.exports[constants.JOURNALSJOURNALLINESTRACKINGCATEGORIES] = JournalsJournalLinesTrackingCategories
module.exports[constants.LINKEDTRANSACTIONS] = LinkedTransactions
module.exports[constants.TRACKINGCATEGORIESOPTIONS] = TrackingCategoriesOptions
module.exports[constants.TRACKINGCATEGORIES] = TrackingCategories
module.exports[constants.TOKENSET] = TokenSet
module.exports[constants.TENANTS] = Tenants
module.exports[constants.MIGRATIONS] = Migrations





