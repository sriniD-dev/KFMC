import pyodbc
from JsonNormalizer import StringParser as sp

class Loader:
    
    def __init__(self, connection):
        self.__conn = connection
        self.__parser = sp()

    
    def execute_sql(self, sql_text):
        
        q = self.__conn.cursor()
        q.execute(sql_text)
        self.__conn.commit()
        
    
    def add_new_column_to_table1(func):
        def wrapper(*args, **kwargs):
            
            #column = 
            ddl = f"""ALTER TABLE {args[1]} ADD COLUMN ;"""
            args[0].execute_sql(ddl)
        
            return func(*args, **kwargs)
        return wrapper
        
    
    def __gen_sql_insert_script(self, table_name: str, rows: list):
        
        field_names = ['[{}]'.format(i) for i in rows[0]]
        field_names = ', '.join(field_names)
        
        f0 = lambda x: str(x).replace('\'','\'\'')  # escaping character ' for sql query
        f1 = lambda x: "'" + f0(x) +"'"
        
        self.__parser.default_parser = 'none_to_null'
        f2 = lambda x: self.__parser.parse(f1(x))  # replace Python None value on SQL null value
        
        f3 = lambda x: '(' + x + ')'
        
        values = []
        for i in rows:
            step1 = ', '.join(map(f2, list(i.values())))
            step2 = f3(step1)
            values.append(step2)
            
        values = ', '.join(values)
        
        sql = f"INSERT INTO {table_name} ({field_names}) VALUES {values};"
        
        return sql  

    #@add_new_column_to_table
    def insert_rows(self, recordlist: dict, db_schema: str, chunksize: int=1000):
        
        for tn,rw in recordlist.items(): 
            a = len(rw)
            i,j = 0,chunksize
            while i < a:
                chunk = rw[i:j]
                print(f'Insert into {db_schema}.{tn}: {len(chunk)}')
                db_object = f'{db_schema}.{tn}'
                sql = self.__gen_sql_insert_script(db_object, chunk)
                self.execute_sql(sql)
                i += chunksize
                j += chunksize
    
    def delete_rows_by_id(self, recordlist: dict, db_schema: str, table_name: str, id_field, chunksize: int=10000):
        rw = recordlist.get(table_name, [])
        a = len(rw)
        i,j = 0,chunksize
        while i < a and a>0:
            print(f'Delete From {db_schema}.{table_name}: {i}')
            chunk = rw[i:j]
            fn1 = lambda x: '\'' + str(x) + '\''
            id_list = list(set([fn1(i[id_field]) for i in chunk]))
            values = ','.join(id_list)
            sql = f"""DELETE FROM {db_schema}.{table_name} WHERE {id_field} in ({values});"""
            self.execute_sql(sql)
            i += chunksize
            j += chunksize
    
    
    
    def __del__(self):
        self.__conn.close()
    

class SQL_Server(Loader):
    
    def __init__(self, connstring: str):
        
        self.__connstring = connstring
        conn = self.__connect_to_db()
        Loader.__init__(self, conn)
        
    
    def __connect_to_db(self):
        try:
            return pyodbc.connect(self.__connstring)
        except:
            raise ValueError('failed to establish a connection to the database. Сheck your connection string')
    
    
    def __close_db_connect(self):
        self.__conn.close()
        
        
    def add_columns_if_not_exists(self, recordlist: dict, db_schema: str,):
        
        def add_column(tn,cn):
            ddl = f"""
              IF COL_LENGTH('{db_schema}.{tn}', '{cn}') IS NULL
                BEGIN ALTER TABLE {db_schema}.{tn} add {[cn]} nvarchar(max) END;
              """
            Loader.execute_sql(self, ddl)
        
        for tn,rw in recordlist.items():
            execute = [add_column(tn, i) for i in rw[0]]
    

if __name__ == "__main__":
    
    connstring ="""Driver={ODBC Driver 17 for SQL Server};
        Server=tcp:kfmc.database.windows.net,1433;
        Database=xero;
        Uid=pb_admin;
        Pwd=yufUyt375Lg;
        Encrypt=yes;
        TrustServerCertificate=no;
        Connection Timeout=30;
        """
    dwh = SQL_Server(connstring)
    
    accounts = {'Accounts': [
        {
        "AccountID": "4test2"
    }
        ]}
    
    #dwh.insert_rows(accounts, 'xero.dpm_egypt', 1000)
    #dwh.delete_rows_by_id(accounts, 'xero.dpm_egypt', 'Accounts', 'AccountID')
    
    dwh.add_columns_if_not_exists({'Accounts':[{'AccountID':1, 'new_column_test1':1, 'new_column_test2': 1}]}, 'dpm_egypt')
