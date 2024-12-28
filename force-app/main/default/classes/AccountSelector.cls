/**
 * @description       : 
 * @author            : BFL Developer
 * @group             : 
 * @last modified on  : 04-14-2024
 * @last modified by  : BFL Developer
**/
public with sharing class AccountSelector {
    public AccountSelector() {

    }


    public static List<Account> getAccountData() {

        ACCOUNT_QUERY__mdt accountQuery = [select Query_Fields__c from ACCOUNT_QUERY__mdt where Method_Name__c = 'getAccountData'];
        String query = 'select ' +accountQuery.Query_Fields__c+' from Account limit 1';
        System.debug('check fields--->    '+ Database.query(query));
        
        return null;
    }



}