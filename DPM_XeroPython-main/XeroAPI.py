from XeroAuth import XeroAuth
import requests
import json
import os.path
#import time
from JsonNormalizer import JsonNormalizer
from XeroConfig import application
import time

class XeroAPI(XeroAuth):
    
    def __init__(self, client_id: str, client_secret: str, tenant_id: str):
        
        XeroAuth.__init__(self, client_id, client_secret)
        
        self.tenant_id = tenant_id
        self.api_vers = '2.0'
        self.__create_tenant_folder_if_not_exists()
        
        self._jn = JsonNormalizer()
        self._session = requests.session()
        
    
    
    def __stop_if_day_limit_empty(func):
        def wrapper(*args,**kwargs):
            r = func(*args, **kwargs)
            if r.status_code == 429:
                day_limit = r.headers.get('X-DayLimit-Remaining', 1)
                if int(day_limit) == 0:
                    print(f'Day Limit Empty max 5000 per day. stop')
                    return {}
                return wrapper(*args, **kwargs)
            return r.json()
        return wrapper 
    
    
    def __slip_if_429_code(func):
        def wrapper(*args, **kwargs):
            r = func(*args, **kwargs)
            minute_limit = int(r.headers.get('X-MinLimit-Remaining', 0))
            if r.status_code == 429 and minute_limit == 0:
                count_second = int(r.headers.get('Retry-After', 60)) + 10
                if minute_limit == 0:
                    print(f'Minute Limit: 60 calls per minute. Sleep {count_second} sec. ')
                    time.sleep(count_second)
                    return wrapper(*args, **kwargs)
            return r
        return wrapper
    
         
    def __print_requests_log(func):
        def wrapper(*arg, **kwarg):
            r = func(*arg, **kwarg)
            limit1 = r.headers.get('X-MinLimit-Remaining')
            limit2 = r.headers.get('X-DayLimit-Remaining')
            limit3 = r.headers.get('X-AppMinLimit-Remaining')
            print(f'{r.status_code}: {r.url} MinLimit: {limit1}; DayLimit: {limit2}; AppMinLimit: {limit3};')
            return r
        return wrapper
        

    def __refresh_tokens_if_403_401(func):
        def wrapper(*args, **kwargs):
            r = func(*args, **kwargs)
            if r.status_code in [403, 401, 200]:
                print('первый')
                print(r.status_code)
                print(r.headers)
                print(r.url)
                super().refreshing_access_tokens()
                base_headers['Authorization'] = "Bearer " + super().access_token
                return wrapper(*args, **kwargs)
            print(r)
            return r
        return wrapper
    
    @__stop_if_day_limit_empty
    @__slip_if_429_code
    @__print_requests_log
    #@__refresh_tokens_if_403_401
    def __get_data(self, endpoint: str, headers: dict, params: dict):
        
        url = f'https://api.xero.com/api.xro/{self.api_vers}/{endpoint}'
        base_headers = {
            'Authorization': "Bearer " + super().access_token,
            'Accept': 'application/json',
            'Xero-tenant-id': self.tenant_id
        }
        base_headers.update(headers)
        r = self._session.get(url, headers=base_headers, params=params)
        if r.status_code in [403, 401]:
            super().refreshing_access_tokens()
            base_headers['Authorization'] = "Bearer " + super().access_token
            r = self._session.get(url, headers=base_headers, params=params)
        return r
    
    
    def __pagination_by_offset(offset: int):
        
        pg_step = 100 
        def decorator(func):
            def wrapper(*args, **kwargs):
                fn,endpoint = func(*args, **kwargs)
                data = fn({}).get(endpoint, [])
                off = int(data[0]['JournalNumber']) + pg_step
                flag = True
                while flag:
                    params = {'offset': off}
                    json = fn(params)
                    obj = json.get(endpoint, [])
                    flag = False if len(obj) == 0 else True
                    off += pg_step
                    data.extend(obj)
                return data 
            return wrapper
        return decorator
    
    
    def __pagination_by_page(page_start: int):

        pg_step = 1 
        def decorator(func):
            def wrapper(*args, **kwargs):
                data = []
                off = page_start
                flag = True
                while flag:
                    params = {'page': off}
                    fn,endpoint = func(*args, **kwargs)
                    json = fn(params)
                    obj = json.get(endpoint, [])
                    flag = False if len(obj) == 0 else True
                    off += pg_step
                    data.extend(obj)
                return data 
            return wrapper
        return decorator
        
        
    def __create_tenant_folder_if_not_exists(self):
        
        tenant_folder = 'ResponceData' +'\\'+ self.tenant_id

        if not os.path.isdir(tenant_folder):
           os.makedirs(tenant_folder)   
    
    
    def __save_json_to_file(filename: str):
        def decorator(func):
            def wrapper(*args, **kwargs):
                obj = func(*args, **kwargs)
                dir_filename = 'ResponceData' +'\\'+ args[0].tenant_id +'\\'+ filename
                with open(dir_filename, 'w', encoding="utf-8") as file:
                     file.write(json.dumps(obj, sort_keys=True, indent=4))
                return obj
            return wrapper
        return decorator
            
    
    def __result_data_to_dict(keyname: str):
        def decorator(func):
            def wrapper(*args, **kwargs):
                data = func(*args, **kwargs)
                obj = {keyname: data}
                return obj
            return wrapper
        return decorator
    
    
    def __norm_line_data(func):
        def wrapper(*args, **kwargs):
            data = func(*args, **kwargs)
            fn = lambda x: args[0]._jn.normalize(x)
            norm = {x:fn(y) for x,y in data.items()}
            return norm
        return wrapper
     
     
    def __norm_structure(entity_name, entity_id):
        def decorator(func):
            def wrapper(*args, **kwargs):
                obj = func(*args, **kwargs)
                first_id_value = None  # should always be None
                res_dict = {}
                table_delimiter = ''
                norm = args[0]._jn.get_all_nested_records(entity_name, entity_id, first_id_value, obj, res_dict, table_delimiter)
                return norm
            return wrapper
        return decorator
    
    @__save_json_to_file('Accounts.json')
    @__norm_line_data
    @__norm_structure(entity_name='Accounts', entity_id='AccountID')
    def accounts(self, modified_after: str):
        endpoint = 'Accounts'
        ma = modified_after + 'T00:00:00'
        headers = {'If-Modified-Since': ma}
        params = {}
        data = self.__get_data(endpoint, headers, params)
        
        return data.get(endpoint, [])
        
    @__save_json_to_file('Contacts.json')
    @__norm_line_data
    @__norm_structure(entity_name='Contacts', entity_id='ContactID')
    def contacts(self, modified_after: str):
        endpoint = 'Contacts'
        ma = modified_after + 'T00:00:00'
        headers = {'If-Modified-Since': ma}
        params = {}
        data = self.__get_data(endpoint, headers, params)
        
        return data.get(endpoint, [])
    
    @__save_json_to_file('Journals.json')
    @__norm_line_data
    @__norm_structure(entity_name='Journals', entity_id='JournalID')
    @__pagination_by_offset(0)
    def journals(self, modified_after: str):
        endpoint = 'Journals'
        ma = modified_after + 'T00:00:00'
        headers = {'If-Modified-Since': ma}
        func = lambda p: self.__get_data(endpoint=endpoint, headers=headers, params=p)
        return func,endpoint
        
    @__save_json_to_file('TrackingCategories.json')
    @__norm_line_data
    @__norm_structure(entity_name='TrackingCategories', entity_id='TrackingCategoryID')    
    def tracking_categories(self):
        endpoint = 'TrackingCategories'
        headers = {}
        params = {}
        data = self.__get_data(endpoint, headers, params)
        return data.get(endpoint, [])
        
    @__save_json_to_file('LinkedTransactions.json')
    @__norm_line_data
    @__norm_structure(entity_name='LinkedTransactions', entity_id='LinkedTransactionID')
    @__pagination_by_page(1)    
    def linked_transactions(self):
        endpoint = 'LinkedTransactions'
        headers = {}
        func = lambda p: self.__get_data(endpoint=endpoint, headers=headers, params=p)
        return func,endpoint 
    
    @__save_json_to_file('BankTransactions.json')
    @__norm_line_data
    @__norm_structure(entity_name='BankTransactions', entity_id='BankTransactionID')
    @__pagination_by_page(1)   
    def bank_transactions(self, modified_after: str):
        endpoint = 'BankTransactions'
        ma = modified_after + 'T00:00:00'
        headers = {'If-Modified-Since': ma}
        func = lambda p: self.__get_data(endpoint=endpoint, headers=headers, params=p)
        return func,endpoint
    
    @__save_json_to_file('Invoices.json')
    @__norm_line_data
    @__norm_structure(entity_name='Invoices', entity_id='InvoiceID')
    @__pagination_by_page(1)   
    def invoices(self, modified_after: str):
        endpoint = 'Invoices'
        ma = modified_after + 'T00:00:00'
        headers = {'If-Modified-Since': ma}
        func = lambda p: self.__get_data(endpoint=endpoint, headers=headers, params=p)
        return func,endpoint

if __name__ == '__main__':
    
    client_id = application[0]['client_id']
    client_secret  = application[0]['client_secret']
    
    dpm_egypt =  XeroAPI(client_id, client_secret, '108b76f9-b4a8-46aa-8df8-5950896b0e51')       
    dpm_uk =  XeroAPI(client_id, client_secret, '0760d204-6c47-457c-bd11-9684f4b4a384')
    
    #dpm_egypt.contacts('2018-01-01')
    #dpm_uk.contacts('2018-01-01')
    
    #dpm_egypt.accounts('2018-01-01')
    #dpm_uk.accounts('2018-01-01')
    
    #dpm_egypt.journals('2021-01-01')
    #dpm_uk.journals(modified_after='2021-01-01')
    
    #dpm_uk.linked_transactions()
    #dpm_egypt.linked_transactions()
    
    #dpm_uk.tracking_categories()
    #dpm_egypt.tracking_categories()
    
    #Xerodpm_egypt.bank_transactions(modified_after='2021-01-01')
    #dpm_uk.bank_transactions(modified_after='2021-01-01')
    
    dpm_egypt.invoices('2021-01-01')
    dpm_uk.invoices('2021-01-01')