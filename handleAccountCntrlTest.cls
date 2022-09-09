@isTest
public with sharing class handleAccountCntrlTest {
    @isTest
    public static void accountCreation(){
        List<Account> accountList = new List<Account>();
        accountList = handleAccountCntrl.getAccountDetails();
        string accountListString = JSON.serialize(accountList);
        string accountName;
        accountListString = handleAccountCntrl.deleteAccount(accountName);
        System.Assert(string.isBlank(accountListString));
    }
    @isTest
    static void deleteAccountTest(){
        Account acc = new Account();
        acc.Name = 'TestAccountNew';
        Insert acc;
        Test.startTest();
        handleAccountCntrl.deleteAccount('TestAccountNew');
        Test.stopTest();
    }
}
