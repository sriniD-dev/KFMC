from XeroAPI import XeroAPI
from XeroConfig import application
import DWHLoader
import json
from datetime import datetime, timedelta

client_id = application[0]['client_id']
client_secret  = application[0]['client_secret']
      
dpm_egypt =  XeroAPI(client_id, client_secret, '108b76f9-b4a8-46aa-8df8-5950896b0e51')       
dpm_uk =  XeroAPI(client_id, client_secret, '0760d204-6c47-457c-bd11-9684f4b4a384')

current_date = datetime.today()
start_date = (current_date - timedelta(days=60)).strftime('%Y-%m-%d')


def get_connstring_from_txt():
    f = open(r'ConnectionStringSQLDatabase.txt', 'r')
    connstring = f.read() 
    f.close()
    return connstring
    
connstring = get_connstring_from_txt()

dwh = DWHLoader.SQL_Server(connstring)   
 
 
#with open('ResponceData\\108b76f9-b4a8-46aa-8df8-5950896b0e51\\journals.json', 'r', encoding="utf-8") as file:
    #journals1 = json.loads(file.read()) 

#with open('ResponceData\\0760d204-6c47-457c-bd11-9684f4b4a384\\journals.json', 'r', encoding="utf-8") as file:
    #journals2 = json.loads(file.read()) 


accounts1 = dpm_egypt.accounts(start_date)
dwh.delete_rows_by_id(accounts1, 'xero.dpm_egypt', 'Accounts', 'AccountID')
dwh.add_columns_if_not_exists(accounts1, 'xero.dpm_egypt')
dwh.insert_rows(accounts1, 'xero.dpm_egypt', 1000)

accounts2 = dpm_uk.accounts(start_date)
dwh.delete_rows_by_id(accounts2, 'xero.dpm_uk', 'Accounts', 'AccountID')
dwh.add_columns_if_not_exists(accounts2, 'xero.dpm_uk')
dwh.insert_rows(accounts2, 'xero.dpm_uk', 1000)

contacts1 = dpm_egypt.contacts(start_date)
dwh.delete_rows_by_id(contacts1, 'xero.dpm_egypt', 'Contacts', 'ContactID')
dwh.add_columns_if_not_exists(contacts1, 'xero.dpm_egypt')
dwh.insert_rows(contacts1, 'xero.dpm_egypt', 1000)

contacts2 = dpm_uk.contacts(start_date)
dwh.delete_rows_by_id(contacts2, 'xero.dpm_uk', 'Contacts', 'ContactID')
dwh.add_columns_if_not_exists(contacts2, 'xero.dpm_uk')
dwh.insert_rows(contacts2, 'xero.dpm_uk', 1000)

journals1 = dpm_egypt.journals(start_date)
dwh.delete_rows_by_id(journals1, 'xero.dpm_egypt','Journals', 'JournalID', 1000)
dwh.add_columns_if_not_exists(journals1, 'xero.dpm_egypt')
dwh.insert_rows(journals1, 'xero.dpm_egypt', 1000)

journals2 = dpm_uk.journals(start_date)
dwh.delete_rows_by_id(journals2, 'xero.dpm_uk','Journals', 'JournalID', 10000)
dwh.add_columns_if_not_exists(journals2, 'xero.dpm_uk')
dwh.insert_rows(journals2, 'xero.dpm_uk', 1000)

trac_cat1 = dpm_egypt.tracking_categories()
dwh.delete_rows_by_id(trac_cat1, 'xero.dpm_egypt','TrackingCategories', 'TrackingCategoryID')
dwh.add_columns_if_not_exists(trac_cat1, 'xero.dpm_egypt')
dwh.insert_rows(trac_cat1, 'xero.dpm_egypt', 1000)

trac_cat2 = dpm_uk.tracking_categories()
dwh.delete_rows_by_id(trac_cat2, 'xero.dpm_uk','TrackingCategories', 'TrackingCategoryID')
dwh.add_columns_if_not_exists(trac_cat2, 'xero.dpm_uk')
dwh.insert_rows(trac_cat2, 'xero.dpm_uk', 1000)

link_tran1 = dpm_egypt.linked_transactions()
dwh.delete_rows_by_id(link_tran1, 'xero.dpm_egypt','LinkedTransactions', 'LinkedTransactionID')
dwh.add_columns_if_not_exists(link_tran1, 'xero.dpm_egypt')
dwh.insert_rows(link_tran1, 'xero.dpm_egypt', 1000)

link_tran2 = dpm_uk.linked_transactions()
dwh.delete_rows_by_id(link_tran2, 'xero.dpm_uk','LinkedTransactions', 'LinkedTransactionID')
dwh.add_columns_if_not_exists(link_tran2, 'xero.dpm_uk')
dwh.insert_rows(link_tran2, 'xero.dpm_uk', 1000)

bank_tran1 = dpm_egypt.bank_transactions(modified_after=start_date)
dwh.delete_rows_by_id(bank_tran1, 'xero.dpm_egypt','BankTransactions', 'BankTransactionID')
dwh.add_columns_if_not_exists(bank_tran1, 'xero.dpm_egypt')
dwh.insert_rows(bank_tran1, 'xero.dpm_egypt', 1000)

bank_tran2 = dpm_uk.bank_transactions(modified_after=start_date)
dwh.delete_rows_by_id(bank_tran2, 'xero.dpm_uk','BankTransactions', 'BankTransactionID')
dwh.add_columns_if_not_exists(bank_tran2, 'xero.dpm_uk')
dwh.insert_rows(bank_tran2, 'xero.dpm_uk', 1000)

Invoices1 = dpm_egypt.invoices(modified_after='2021-01-01')
dwh.delete_rows_by_id(Invoices1, 'xero.dpm_egypt','Invoices', 'InvoiceID')
dwh.add_columns_if_not_exists(Invoices1, 'xero.dpm_egypt')
dwh.insert_rows(Invoices1, 'xero.dpm_egypt', 1000)

Invoices2 = dpm_uk.invoices(modified_after='2021-01-01')
dwh.delete_rows_by_id(Invoices2, 'xero.dpm_uk','Invoices', 'InvoiceID')
dwh.add_columns_if_not_exists(Invoices2, 'xero.dpm_uk')
dwh.insert_rows(Invoices2, 'xero.dpm_uk', 1000)