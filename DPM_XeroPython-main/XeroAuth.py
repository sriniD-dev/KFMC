import requests
import webbrowser
import re
import json
import base64
import os.path
import time
from XeroConfig import application

class XeroAuth: 

    
    def __init__(self, client_id: str, client_secret: str):
    
        self.client_id = client_id
        self.client_secret = client_secret
        self.__appl_num = 0  # main app is 0 in XeroConfig.application, other app is reserv. API limit problem
        
        self.redirect_uri = 'https://oauth.powerbi.com/views/oauthredirect.html'
        self._access_token = ''
        self._refresh_token = ''
        
        self.__set_last_token_from_json()
        self.tenants = self.get_tenants()
    
    
    @property
    def access_token(self):
        return self._access_token
    
    @access_token.setter
    def access_token(self, value):
        self._access_token = value
        
    @property
    def refresh_token(self):
        return self._refresh_token
    
    @refresh_token.setter
    def refresh_token(self, value):
        self._refresh_token = value
    
        
    def __get_authorize_url(self):
        
        url = 'https://login.xero.com/identity/connect/authorize?'
        
        scope = [
          'offline_access',
          'accounting.transactions',
          'accounting.reports.read',
          'accounting.journals.read',
          'accounting.settings',
          'accounting.contacts'
        ]
        
        params = {
            'response_type':'code',
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'scope': ' '.join(scope),
            'state': '123'
        }
        
        auth_url = requests.get(url, params).url
        
        return auth_url
    
    
    def __get_auth_code(self):

        auth_url = self.__get_authorize_url()
        webbrowser.open(auth_url)

        def parseUrlQuery(url: str):

            try:
                search_result = re.search('code=(.*)&scope*', url)
                auth_code = search_result.group(1)
            except:
                raise Exception('url link does not contain parameters: code, state, realmId')

            return auth_code

        print('please log in and enter the link:')

        code = parseUrlQuery(input())
        
        return code


    def __save_json_file(filename: str):
        def decorator(func):
            def wrapper(*args, **kwargs):
                obj = func(*args, **kwargs)
                with open(filename, 'w', encoding="utf-8") as file:
                     file.write(json.dumps(obj, sort_keys=True, indent=4))
                return obj
            return wrapper
        return decorator
        
        
    def __create_or_update_json_file(filename: str):
        def decorator(func):
            def wrapper(*args, **kwargs):
                obj = func(*args, **kwargs)
                curr_obj = {}
                check_file = os.path.exists(filename)
                if check_file:
                    with open(filename, 'r', encoding="utf-8") as file:
                         curr_obj = json.loads(file.read())
                curr_obj.update(obj)
                with open(filename, 'w', encoding="utf-8") as file:
                    file.write(json.dumps(curr_obj, sort_keys=True, indent=4))
                return obj
            return wrapper
        return decorator
    
    
    def __check_accesstoken_file(func):
        def wrapper(*args, **kwargs):
            check_file = os.path.exists('XeroClientAccess.json')
            if not check_file:
                args[0].get_access_token()
            return func(*args, **kwargs)
        return wrapper
    
    
    def __chek_auth_request_status(func):
        def wrapper(*args, **kwargs):
            r = func(*args, **kwargs)
            if r.status_code == 200:
                return {args[0].client_id: r.json()}
            print(f'AUTHORIZATION FAILED: {r.status_code} \n\t {r.headers} \n\t {r.json()} \nPlease authorise to the Xero Service')
            new_token = args[0].get_access_token()
            return new_token
        return wrapper
    
    
    @__create_or_update_json_file('XeroClientAccess.json')
    @__chek_auth_request_status
    def __auth_exchange_requests(self, payload: dict):
        
        url = 'https://identity.xero.com/connect/token'
        token64 = base64.b64encode(f'{self.client_id}:{self.client_secret}'.encode()).decode()
        
        headers = {
            'authorization': "Basic " + token64,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        # 5 attempts to get response from Xero Services
        n = 0
        while n < 3:
            r = requests.post(url, headers=headers, data=payload)
            if r.status_code in [200, 400]:
                n = 3
            else:
                n += 1
                time.sleep(15)   
        return r
    
    
    def get_access_token(self):
    
        code = self.__get_auth_code()
    
        payload = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': self.redirect_uri
        }
        return self.__auth_exchange_requests(payload)
       
       
    def refreshing_access_tokens(self):
    
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': self._refresh_token
        }
        
        token = self.__auth_exchange_requests(payload)
        
        self._access_token = token[self.client_id]['access_token']
        self._refresh_token = token[self.client_id]['refresh_token']
    
        
    def __refresh_token(func):
        def wrapper(*args, **kwargs):
            f = func(*args, **kwargs)
            args[0].refreshing_access_tokens()           
            return f
        return wrapper    
    
    
    @__refresh_token
    @__check_accesstoken_file
    def __set_last_token_from_json(self):
            
        f = open('XeroClientAccess.json', 'r') 
        token = json.loads(f.read())
        f.close()
        self._access_token = token.get(self.client_id, {}).get('access_token', '')
        self._refresh_token = token.get(self.client_id, {}).get('refresh_token', '')
            
    
    @__create_or_update_json_file('Tenants.json')    
    def get_tenants(self):
        
        url = 'https://api.xero.com/connections'
        headers = {
            'Authorization': "Bearer " + self.access_token,
            'Content-Type': 'application/json'
        }
        
        r = requests.get(url, headers=headers)
        
        if r.status_code in [403, 401]:
            self.refreshing_access_tokens()
            headers['Authorization'] = "Bearer " + self.access_token
            r = requests.get(url, headers=headers)
            
        tenants = {self.client_id: r.json()}     
        return tenants   

        
    def _re_init_into_reserv_app(self):
        
        apps = application
        if self.__appl_num < len(apps) -1:
            self.__appl_num += 1
        else:
            self.__appl_num = 0
        
        client = apps[self.__appl_num]
        
        self.client_id = client['client_id']
        self.client_secret = client['client_secret']
        

    
def start_program():
    
    print('please enter the client id:')
    client_id = '4AC746B4431C4922B32FAD6C3427EEC5' #input()
    print('please enter the client secret:')
    client_secret = 'PyM2r5yhPTgYVgSdN_1C_CrgxsnTlFroee-VFXWjpQ7zzuU6' #input()
    
    client = XeroAuth(client_id, client_secret)
    
    #at = client.authorization()
    #print(at)


def ut_re_init_into_reserv_app():
    
    apps = application
    client_a = apps[0]
    
    a = client = XeroAuth( \
            client_a['client_id'],\
            client_a['client_secret'])
    
    for i in range(5):     
        print(f'app: {a.appl_num}: {a.client_id}: {a.client_secret}')
        a.re_init_into_reserv_app()



if __name__ == "__main__":
    start_program()
    #ut_re_init_into_reserv_app()
    