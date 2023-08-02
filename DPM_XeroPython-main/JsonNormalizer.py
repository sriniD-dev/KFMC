import re
from datetime import datetime, timedelta
        
class StringParser:
    
    def __init__(self):
    
        self.__default_parser = [
            'none_to_null', 
            'convert_unixdate_to_datetime', 
            'bool_to_int'
            ] 
    
    @property
    def default_parser(self):
        return self.__default_parser
        
    @default_parser.setter
    def default_parser(self, value):
        switch = {
            list: value, 
            str: [value]
            }
        arg_type = type(value)
        self.__default_parser = switch.get(arg_type, self.__default_parser) 
        
    
    def __bool_to_int(self, value):

        bool_value = {
            'true': 1, '1': 1,
            'false': 0, '0': 0
            } 
        res = bool_value.get(str(value).lower(), value)
        return res
   
   
    def __none_to_null(self, value):
    
        none_value = {
            '': 'null', 'none': 'null', 
            'null': 'null',"''": 'null', 
            "'null'": 'null', "'none'": 'Null'
            }
        res = none_value.get(str(value).lower(), value)    
        return res
     
      
    def __convert_unixdate_to_datetime(self, value):
        
        mask = '/Date\((\d{13})\+(\d{4})\)/'
        return_mask = '%Y-%m-%d %H:%M:%S'

        parce = re.search(mask, str(value))
        if bool(parce):
            mlsecond = parce.group(1)
            #tz_offset = parce.group(2)
            dateformat = datetime(1970, 1, 1) + timedelta(milliseconds=int(mlsecond))
            format_date = dateformat.strftime(return_mask)
            return format_date
        else:
            return value
    
    
    def parse(self, value):
        
        config = {
            'none_to_null': self.__none_to_null,
            'convert_unixdate_to_datetime': self.__convert_unixdate_to_datetime,
            'bool_to_int': self.__bool_to_int
            }
        
        func_not_find = lambda x: x
        
        result_str = value
        for i in self.__default_parser:
            func = config.get(i, func_not_find)
            result_str = func(result_str)
        
        return result_str



class JsonNormalizer:
    
    def __init__(self):
    
        pass
    
    def normalize(self, list_of_records: list):
    
        parser = StringParser()
        parser.default_parser = ['none_to_null', 'convert_unixdate_to_datetime', 'bool_to_int'] 
    
        def get_record_fields(json_obj: dict, element: str='', res: dict={}):
            for i, j in json_obj.items():
                if type(j) == list:
                    continue
                if type(j) == dict:
                        get_record_fields(j, element + i + '_', res)
                else:
                    res[element + i] = parser.parse(j)  # unixdate convert to "dd.mm.yy hh:mm:ss"; replace None/'' to null; convert True\False to 1/0   
            return res
        
        def sort_data(rows: list, field_example: list):
            return [{f: r.get(f, None) for f in field_example} for r in rows]
        
        result = [get_record_fields(a, '', {}) for a in list_of_records]
        field_names = sorted(list(set([f for k in result for f in k.keys()])))
    
        return sort_data(result, field_names)
     
    
    def __compare_two_str(self, a_string: str, b_strings: list):
    
        result = ''
        m = 0
        for i in b_strings:
            n = 0
            for a,b in zip(list(a_string), list(i)):
                if a == b:
                    n += 1
                else:
                    break
            if n>m:
                m = n
                result = i
        return result
    
    
    def get_all_nested_records(self, tablename: str, idname, id, lstrec: list, res: {}, table_delimiter: str='.'):
        if type(lstrec) == list and len(lstrec) > 0:
            #print(f'{tablename} {idname} {id}')
            add_id = lambda x: [{**a, **id} for a in x] # add ID from parent element
            rec = add_id(lstrec) if id is not None else lstrec
            rec = self.normalize(rec)
            if tablename in res:
                res[tablename].extend(rec)
            else:
                res[tablename] = rec
            for r in lstrec:
                for k,v in r.items():
                    tn = tablename + table_delimiter + k
                    fn = lambda x: 'ID' in x[-2:]
                    a = [x for x in list(r.keys()) if fn(x)]
                    id_find = self.__compare_two_str(idname, a)  # find ID field by comparer name
                    i = {id_find: r.get(id_find)}
                    self.get_all_nested_records(tn, k, i, v, res, table_delimiter)  # recursive
        return res
    


def ut_bool_to_int(*args):    
    a = StringParser()
    a.default_parser = 'bool_to_int'
    
    test_values = [
        None, True, False, 'True','TrUe','FalSE','TrueUyt', 
        'False','false','true', 1, 0, '1', '0', 'aaa', 
        334, -1, {'a':1}, [1,2,'k']
        ]

    for i in test_values:
        r = a.parse(i)
        print(f'Value: {i} \t\t Type \t{type(i)} \t\t Result {r}')
        
        
def ut_none_to_null():    
    a = StringParser()
    a.default_parser = 'none_to_null'
    
    test_values = ['', None, 'null', 'nUll', 'NULL', 'aaa', 1, -1, 'Ata23']

    for i in test_values:
        r = a.parse(i)
        print(f'Value: {i} \t\t Type \t\t{type(i)} \t\t Result {r}')
 
 
def ut_convert_utc_to_datetime():
    
    a = StringParser()
    a.default_parser = 'convert_unixdate_to_datetime'
    
    test_value = [
        '/Date(1531223433430+0000)/'
    ]
    
    for i in test_value:
        r = a.parse(i)
        print(f'Value: {i} \t\t Result {r}')


def ut_parse_string():
    
    a = StringParser()
    
    test_values = ['', None, 'null', 'nUll', 'NULL', '/Date(1531223433430+0000)/', 'aaa', 1, -1, 'Ata23', False, 'True','TrUe','FalSE','TrueUyt']
    for i in test_values:
        r = a.parse(i)
        print(f'Value: {i} \t\t Result {r}')
        

def ut_normalize():

    test_json = [
        {
            "AccountID": "40429c30-23b2-4cf0-99ae-d2313ec262e3",
            "AddToWatchlist": "false",
            "BankAccountNumber": "null",
            "BankAccountType": "",
            "Class": "EXP'E'NSE",
            "Code": "3502",
            "CurrencyCode": None,
            "Description": "",
            "EnablePaymentsToAccount": "false",
            "HasAttachments": "false",
            "Name": "Trustees' Travel Expenses",
            "ReportingCode": "EXP",
            "ReportingCodeName": "Expense",
            "ShowInExpenseClaims": "true",
            "Status": "ACTIVE",
            "TaxType": "NONE",
            "Type": "EXPENSE",
            "UpdatedDateUTC": "/Date(1531223433430+0000)/"
        }
    ]

    a = JsonNormalizer()
    
    print(a.normalize(test_json))
 

def ut_normalize2():

    test_record = [
            {
        "BankTransactionID": "ba534621-5e6d-49f9-b204-ae044501b1ea",
        "LineItems": [
            {
               
                "LineItemID": "42798ed8-16ca-411b-86e0-9fa932474a23",
               
                "Tracking": [
                    {
                        "TrackingCategoryID": "e331f3b3-830b-4f2c-8cb3-fd92855d5a84"
                    }
                    
                ],
            }
        ],
    }]
    
    a = JsonNormalizer()
    print(a.get_all_nested_records('BankTransactions', 'BankTransactionID', None, test_record, {}))

 
if __name__ == "__main__":
    
    #print('\n\ntest1: bool_to_int \n')
    #ut_bool_to_int()
    
    #print('\n\ntest2: none_to_null \n')
    #ut_none_to_null()
    
    #print('\n\ntest3: ut_convert_utc_to_datetime \n')
    #ut_convert_utc_to_datetime()
    
    #print('\n\ntest4: ut_parse_string \n')
    #ut_parse_string()
    
    #print('\n\ntest5: ut_normalize \n')
    #ut_normalize()
    
    print('\n\ntest6: ut_normalize2 \n')
    ut_normalize2()
