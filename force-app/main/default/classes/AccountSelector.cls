/**
 * @description       :
 * @author            : BFL Developer
 * @group             :
 * @last modified on  : 05-17-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
 **/
public without sharing class AccountSelector {
    public AccountSelector() {
        
    }
    
    @AuraEnabled
    public static List<Account> getAccountData() {
        
        ACCOUNT_QUERY__mdt accountQuery = [select Query_Fields__c from ACCOUNT_QUERY__mdt where Method_Name__c = 'getAccountData'];
        String query = 'select ' +accountQuery.Query_Fields__c+' from Account limit 1';
        System.debug('check fields--->    '+ Database.query(query));
        
        return null;
    }
    
    @AuraEnabled
    public static List<Icon_with_Href__mdt> getIconsMetaData() {
        
        return [select id,Label,href_URL__c,SVG__c from Icon_with_Href__mdt order by Icon_Prority__c];
        // String query = 'select ' +accountQuery.Query_Fields__c+' from Account limit 1';
        // System.debug('check fields--->    '+ Database.query(query));
        
        // return null;
    }
    
    
    @AuraEnabled
    public static List<Account> getAccountDataNew(String str) {
        
        ACCOUNT_QUERY__mdt accountQuery = [select Query_Fields__c from ACCOUNT_QUERY__mdt where Method_Name__c = 'getAccountData'];
        String query = 'select ' +accountQuery.Query_Fields__c+' from Account limit 1';
        System.debug('check fields--->    '+ Database.query(query));
        
        return null;
    }
    
    @future
    public static void testFuture(List<Id> ss){
        
    }
    @AuraEnabled
    public static My_Site_Vist__c getVisitCount(String visitId) {
        
        return [select Id,Name,Portfolio_Visit__c from My_Site_Vist__c where name like '%PortFolio visitor%' limit 1];
        
        
        
    }
    
    
    
    
    @AuraEnabled
    public static String createVisitorIpReocrd(String ipObj) {
        try{

        Site_Visit_Ip_Tracker__c ipObjectToInsert = (Site_Visit_Ip_Tracker__c) JSON.deserialize(ipObj, Site_Visit_Ip_Tracker__c.class);
        insert ipObjectToInsert;
        
        return 'yes';
        }catch(Exception e){
            throw new AuraHandledException('errr create bdm-----'+e.getMessage());
        }
        
        
    }
    @AuraEnabled
    public static String updateVisitCount(String visitCountObj) {
        My_Site_Vist__c visitObjectToInsert = (My_Site_Vist__c) JSON.deserialize(visitCountObj, My_Site_Vist__c.class);
        update visitObjectToInsert;
        
        return 'yes';
        
        
    }


     @AuraEnabled
    public static Map<String,jobDescriptionWrapper> getJobLists() {
        Map<String,jobDescriptionWrapper> jobDescriptionList = new Map<String,jobDescriptionWrapper>(); 
        // List<String> jobTabs = new List<String>();       
        for (Professional_Summary__mdt job : [SELECT Id,DeveloperName,MasterLabel,Language,NamespacePrefix,Label,QualifiedApiName,SystemModstamp,Company_Title__c,Start_Date__c,Tab_Priority__c,End_Date__c,Job_Description__c,Position__c from Professional_Summary__mdt order by Tab_Priority__c  LIMIT 200]) {
            jobDescriptionWrapper jobCurrent = new jobDescriptionWrapper();
            // jobCurrent.jobTitle = job.Company_Title__c;
            jobCurrent.jobLocation = 'Bengaluru, Karnataka, India';
            jobCurrent.startDate = job.Start_Date__c;
            jobCurrent.endDate = job.End_Date__c;
            jobCurrent.position = job.Position__c;
            jobCurrent.jobCompanyName = job.Company_Title__c;
            if (!String.isEmpty(job.Job_Description__c)) {
                List<String> jobDescSummry = job.Job_Description__c.split('#');
                jobCurrent.jobDescription = jobDescSummry;
            }

            // jobTabs.add(job.Company_Title__c);
            jobDescriptionList.put(job.Company_Title__c, jobCurrent);
        }

        return jobDescriptionList;
        
    }

    @AuraEnabled
    public static AggregateResult getVisitorsCountTillNow(){
        return [select COUNT_DISTINCT(Visitors_Ip__c) visitcount from Site_Visit_Ip_Tracker__c]??null;
    }





    public class jobDescriptionWrapper {
        // @AuraEnabled public List<String> jobTabs { get; set; }
        
        @AuraEnabled public List<String> jobDescription { get; set; }
        @AuraEnabled public String jobTitle { get; set; }
        @AuraEnabled public String jobId { get; set; }
        @AuraEnabled public String jobType { get; set; }
        @AuraEnabled public String jobLocation { get; set; }
        @AuraEnabled public String jobCompanyName { get; set; }
        @AuraEnabled public String jobCompanyLogo { get; set; }
        @AuraEnabled public String startDate { get; set; }
        @AuraEnabled public String endDate { get; set; }
        @AuraEnabled public String position { get; set; }
    }












    @AuraEnabled
    public static List<Certification_Portfolio__mdt> getSfdcCerificationWrapper() {
    //    return [select id,DistributionPublicUrl from ContentDistribution ]??null;
       return [select Id,Sequence_Number__c,Title__c,Certificate_URL__c,static_resource_img_path__c from Certification_Portfolio__mdt  where Is_Active__c =true order by Sequence_Number__c asc LIMIT 200 ]??null;
    }
        




    public class sfdcCerificationWrapper {
        // @AuraEnabled public List<String> jobTabs { get; set; }
    
        @AuraEnabled public String title { get; set; }
        @AuraEnabled public String endDate { get; set; }
        @AuraEnabled public String position { get; set; }
    }

    

    @AuraEnabled
    public static void saveFeedBack(String feedBackJson) {
        try{
            FeedBack_Data__c feedBackObjectToInsert = (FeedBack_Data__c) JSON.deserialize(feedBackJson, FeedBack_Data__c.class);
            insert feedBackObjectToInsert;
        }catch(Exception e){
            throw new AuraHandledException('errr create bdm-----'+e.getMessage());
        }
        
    }
      
    
        
}