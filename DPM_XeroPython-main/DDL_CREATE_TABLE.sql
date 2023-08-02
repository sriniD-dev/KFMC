
--DROP TABLE accounts;
 CREATE TABLE xero.dpm_uk.accounts ( AccountID nvarchar(50),
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
--DROP TABLE contacts;

 CREATE TABLE xero.dpm_uk.contacts ( ContactID nvarchar(50) primary key not null,
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
--DROP TABLE ContactsAddresses;
 CREATE TABLE xero.dpm_uk.ContactsAddresses ( ContactID nvarchar(50) not null ,
AddressLine1 nvarchar(255),
AddressLine2 nvarchar(255),
AddressLine3 nvarchar(255),
AddressLine4 nvarchar(255),
AddressType nvarchar(255),
AttentionTo nvarchar(255),
City nvarchar(100),
Country nvarchar(100),
PostalCode nvarchar(100),
Region nvarchar(100) CONSTRAINT FK_Contact_Adresses FOREIGN KEY (ContactID) REFERENCES xero.dpm_uk.Contacts (ContactID) ON
DELETE CASCADE) ;

--DROP TABLE ContactsPhones;
 CREATE TABLE xero.dpm_uk.ContactsPhones ( ContactID nvarchar(50) not null,
PhoneAreaCode nvarchar(100),
PhoneCountryCode nvarchar(100),
PhoneNumber nvarchar(255),
PhoneType nvarchar(100) CONSTRAINT FK_Contact_Phones FOREIGN KEY (ContactID) REFERENCES xero.dpm_uk.Contacts (ContactID) ON
DELETE CASCADE) ;

--DROP TABLE Journals;
 CREATE TABLE xero.dpm_uk.Journals ( CreatedDateUTC datetime,
JournalDate datetime,
JournalID nvarchar(50) primary key not null,
JournalNumber int,
Reference nvarchar(255),
SourceID nvarchar(50),
SourceType nvarchar(50) );

--DROP TABLE JournalsJournalLines;
 CREATE TABLE xero.dpm_uk.JournalsJournalLines ( AccountCode nvarchar(100),
AccountID nvarchar(50),
AccountName nvarchar(255),
AccountType nvarchar(255),
Description nvarchar(max),
GrossAmount real,
JournalID nvarchar(50) not null,
JournalLineID nvarchar(50) primary key not null,
NetAmount real,
TaxAmount real,
TaxName nvarchar(255),
TaxType nvarchar(100) CONSTRAINT FK_Journals_JournalLines FOREIGN KEY (JournalID) REFERENCES xero.dpm_uk.Journals (JournalID) ON
DELETE CASCADE) ;

--DROP TABLE JournalsJournalLinesTrackingCategories;
 CREATE TABLE xero.dpm_uk.JournalsJournalLinesTrackingCategories ( JournalLineID nvarchar(50) not null,
[Name] nvarchar(255),
[Option] nvarchar(255),
TrackingCategoryID nvarchar(50),
TrackingOptionID nvarchar(50) CONSTRAINT FK_JournalLines_TrackingCategories FOREIGN KEY (JournalLineID) REFERENCES xero.dpm_uk.JournalsJournalLines (JournalLineID) ON
DELETE CASCADE) ;

CREATE TABLE xero.dpm_uk.TrackingCategories ( [Name] nvarchar(255),
[Status] nvarchar(100),
TrackingCategoryID nvarchar(50) primary key not null );

CREATE TABLE xero.dpm_uk.TrackingCategoriesOptions ( TrackingCategoryID nvarchar(50) not null,
TrackingOptionID nvarchar(50) primary key not null,
HasValidationErrors int,
IsActive int,
IsArchived int,
IsDeleted int,
[Name] nvarchar(255),
[Status] nvarchar(100) CONSTRAINT FK_TrackingCategories_TrackingCategoriesOptions FOREIGN KEY (TrackingCategoryID) REFERENCES xero.dpm_uk.TrackingCategories (TrackingCategoryID) ON
DELETE CASCADE) ;

CREATE TABLE xero.dpm_uk.LinkedTransactions ( LinkedTransactionID nvarchar(50),
ContactID nvarchar(50),
SourceLineItemID nvarchar(50),
SourceTransactionID nvarchar(50),
SourceTransactionTypeCode nvarchar(50),
Status nvarchar(50),
TargetLineItemID nvarchar(50),
TargetTransactionID nvarchar(50),
[Type] nvarchar(100),
UpdatedDateUTC datetime );

CREATE TABLE xero.dpm_uk.BankTransactions ( BankTransactionID nvarchar(50) primary key not null,
BankAccount_AccountID nvarchar(50),
BankAccount_Code nvarchar(50),
BankAccount_Name nvarchar(255),
BatchPayment_Account_AccountID nvarchar(50),
BatchPayment_BatchPaymentID nvarchar(50),
BatchPayment_Date nvarchar(50),
BatchPayment_DateString nvarchar(100),
BatchPayment_IsReconciled nvarchar(100),
BatchPayment_Status nvarchar(100),
BatchPayment_TotalAmount real,
BatchPayment_Type nvarchar(100),
BatchPayment_UpdatedDateUTC nvarchar(100),
Contact_ContactID nvarchar(50),
Contact_HasValidationErrors int,
Contact_Name nvarchar(255),
CurrencyCode nvarchar(100),
CurrencyRate nvarchar(100),
[Date] datetime,
DateString nvarchar(50),
ExternalLinkProviderName nvarchar(max),
HasAttachments int,
IsReconciled int,
LineAmountTypes nvarchar(50),
OverpaymentID nvarchar(255),
Reference nvarchar(100),
[Status] nvarchar(50),
SubTotal real,
Total real,
TotalTax real,
[Type] nvarchar(50),
UpdatedDateUTC datetime,
Url nvarchar(max) );

CREATE TABLE xero.dpm_uk.BankTransactionsLineItems ( LineItemID nvarchar(50) primary key not null,
BankTransactionID nvarchar(50) not null,
AccountCode nvarchar(50),
[Description] nvarchar(max),
LineAmount real,
Quantity real,
TaxAmount real,
TaxType nvarchar(100),
UnitAmount real CONSTRAINT FK_BankTransactions_LineItems FOREIGN KEY (BankTransactionID) REFERENCES xero.dpm_uk.BankTransactions (BankTransactionID) ON
DELETE CASCADE) ;

CREATE TABLE xero.dpm_uk.BankTransactionsLineItemsTracking ( LineItemID nvarchar(50),
[Name] nvarchar(100),
[Option] nvarchar(100),
TrackingCategoryID nvarchar(50) CONSTRAINT FK_BankTransactionsLineItems_Tracking FOREIGN KEY (LineItemID) REFERENCES xero.dpm_uk.BankTransactionsLineItems (LineItemID) ON
DELETE CASCADE) ;

create table xero.dpm_egypt.Invoices ( 
InvoiceID nvarchar(50) primary key not null,
AmountCredited real,
AmountDue real,
AmountPaid real,
BrandingThemeID nvarchar(50),
Contact_ContactID nvarchar(50),
Contact_HasValidationErrors int,
Contact_Name nvarchar(255),
CurrencyCode nvarchar(50),
CurrencyRate real,
[Date] datetime,
DateString nvarchar(100),
DueDate datetime,
DueDateString nvarchar(50),
FullyPaidOnDate datetime,
PlannedPaymentDate datetime,
PlannedPaymentDateString nvarchar(50),
RepeatingInvoiceID nvarchar(50),
SentToContact nvarchar(50),
HasAttachments int,
HasErrors int,
InvoiceNumber nvarchar(355),
IsDiscounted int,
LineAmountTypes nvarchar(100),
Reference nvarchar(max),
Status nvarchar(50),
SubTotal real,
Total real,
TotalTax real,
[type] nvarchar(50),
UpdatedDateUTC datetime,
[Url] nvarchar(max));

create table xero.dpm_egypt.InvoicesPayments ( PaymentID nvarchar(50) primary key not null,
InvoiceID nvarchar(50) not null,
BatchPaymentID nvarchar(50),
Amount real,
CurrencyRate real,
[Date] datetime,
HasAccount int,
HasValidationErrors int,
Reference nvarchar(max)
CONSTRAINT FK_Invoices_Payments FOREIGN KEY (InvoiceID) REFERENCES xero.dpm_egypt.Invoices (InvoiceID) ON
DELETE CASCADE) 
;

create table xero.dpm_egypt.InvoicesLineItems ( LineItemID nvarchar(50) primary key not null,
InvoiceID nvarchar(50) not null,
AccountCode nvarchar(50),
[Description] nvarchar(max),
DiscountRate real,
ItemCode nvarchar(255),
LineAmount real,
Quantity real,
TaxAmount real,
TaxType nvarchar(50),
UnitAmount real CONSTRAINT FK_Invoices_LineItems FOREIGN KEY (InvoiceID) REFERENCES xero.dpm_egypt.Invoices (InvoiceID) ON
DELETE CASCADE) ;

create table xero.dpm_egypt.InvoicesLineItemsTracking ( TrackingCategoryID nvarchar(50) not null,
LineItemID nvarchar(50) not null,
[Name] nvarchar(255),
[option] nvarchar(max) CONSTRAINT FK_LineItems_Tracking FOREIGN KEY (LineItemID) REFERENCES xero.dpm_egypt.InvoicesLineItems (LineItemID) ON
DELETE CASCADE) ;

create table  xero.dpm_egypt.InvoicesCreditNotes ( 
ID nvarchar(50) primary key not null,
InvoiceID nvarchar(50) not null,
AppliedAmount real,
CreditNoteID nvarchar(50),
CreditNoteNumber nvarchar(100),
[Date] datetime,
DateString datetime,
HasErrors int,
Total real constraint FK_Invoices_CreditNotes foreign key (InvoiceID) references xero.dpm_egypt.Invoices (InvoiceID) on
delete cascade) ;

create table  xero.dpm_egypt.InvoicesOverpayments ( ID nvarchar(50) primary key not null,
InvoiceID nvarchar(50) not null,
OverpaymentID nvarchar(50),
AppliedAmount real,
Date datetime,
DateString datetime,
Total real constraint FK_Invoices_Overpayments foreign key (InvoiceID) references xero.dpm_egypt.Invoices (InvoiceID) on
delete
	cascade);      



drop table dpm_uk.[Accounts];
drop table dpm_uk.[BankTransactions];
drop table dpm_uk.[BankTransactionsLineItems];
drop table dpm_uk.[BankTransactionsLineItemsTracking];
drop table dpm_uk.[Contacts];
drop table dpm_uk.[ContactsAddresses];
drop table dpm_uk.[ContactsPhones];
drop table dpm_uk.[Journals];
drop table dpm_uk.[JournalsJournalLines];
drop table dpm_uk.[JournalsJournalLinesTrackingCategories];
drop table dpm_uk.[LinkedTransactions];
drop table dpm_uk.[TrackingCategories];
drop table dpm_uk.[TrackingCategoriesOptions];

drop table xero.dpm_egypt.Invoices;
drop table xero.dpm_egypt.InvoicesPayments;
drop table xero.dpm_egypt.InvoicesLineItems;
drop table xero.dpm_egypt.InvoicesLineItemsTracking;
drop table xero.dpm_egypt.InvoicesCreditNotes;
drop table xero.dpm_egypt.InvoicesOverpayments;

drop table xero.dpm_egypt.Invoices;
drop table xero.dpm_egypt.InvoicesPayments;
drop table xero.dpm_egypt.InvoicesLineItems;
drop table xero.dpm_egypt.InvoicesLineItemsTracking;
drop table xero.dpm_egypt.InvoicesCreditNotes;
drop table xero.dpm_egypt.InvoicesOverpayments;

select * from xero.dpm_uk.InvoicesLineItems 


