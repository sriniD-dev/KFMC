DROP TABLE accounts;

CREATE TABLE accounts ( AccountID nvarchar(50),
Description nvarchar(MAX),
SystemAccount nvarchar(100),
AddToWatchlist int,
BankAccountNumber nvarchar(50),
BankAccountType nvarchar(50),
Class nvarchar(50),
Code nvarchar(50),
CurrencyCode nvarchar(50),
EnablePaymentsToAccount int,
HasAttachments int,
Name nvarchar(100),
ReportingCode nvarchar(50),
ReportingCodeName nvarchar(50),
ShowInExpenseClaims int,
Status nvarchar(50),
TaxType nvarchar(50),
[Type] nvarchar(50),
UpdatedDateUTC datetime );

DROP TABLE contacts;

CREATE TABLE contacts ( ContactID nvarchar(100),
LastName nvarchar(255),
FirstName nvarchar(255),
Name nvarchar(255),
ContactNumber nvarchar(100),
AccountNumber nvarchar(100),
AccountsPayableTaxType nvarchar(100),
AccountsReceivableTaxType nvarchar(100),
Balances_AccountsPayable_Outstanding real,
Balances_AccountsPayable_Overdue real,
Balances_AccountsReceivable_Outstanding real,
Balances_AccountsReceivable_Overdue real,
BankAccountDetails nvarchar(100),
ContactStatus nvarchar(100),
DefaultCurrency nvarchar(100),
EmailAddress nvarchar(255),
HasAttachments int,
HasValidationErrors int,
IsCustomer int,
IsSupplier int,
SkypeUserName nvarchar(255),
TaxNumber nvarchar(255),
UpdatedDateUTC datetime );

DROP TABLE ContactsAddresses;

CREATE TABLE ContactsAddresses ( ContactID nvarchar(50),
AddressLine1 nvarchar(255),
AddressLine2 nvarchar(255),
AddressLine3 nvarchar(255),
AddressLine4 nvarchar(255),
AddressType nvarchar(255),
AttentionTo nvarchar(255),
City nvarchar(100),
Country nvarchar(100),
PostalCode nvarchar(100),
Region nvarchar(100) );

DROP TABLE ContactsPhones;

CREATE TABLE ContactsPhones ( ContactID nvarchar(50),
PhoneAreaCode nvarchar(100),
PhoneCountryCode nvarchar(100),
PhoneNumber nvarchar(255),
PhoneType nvarchar(100) );

DROP TABLE Journals;

CREATE TABLE Journals ( CreatedDateUTC datetime,
JournalDate datetime,
JournalID nvarchar(50),
JournalNumber int,
Reference nvarchar(255),
SourceID nvarchar(50),
SourceType nvarchar(50) );

DROP TABLE JournalsJournalLines;

CREATE TABLE JournalsJournalLines ( AccountCode nvarchar(100),
AccountID nvarchar(50),
AccountName nvarchar(255),
AccountType nvarchar(255),
Description nvarchar(max),
GrossAmount real,
JournalID nvarchar(50),
JournalLineID nvarchar(50),
NetAmount real,
TaxAmount real,
TaxName nvarchar(255),
TaxType nvarchar(100) );

DROP TABLE JournalsJournalLinesTrackingCategories;

CREATE TABLE JournalsJournalLinesTrackingCategories ( JournalLineID nvarchar(50),
Name nvarchar(255),
Option nvarchar(255),
TrackingCategoryID nvarchar(50),
TrackingOptionID nvarchar(50) );
