import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import saveFeedBack from '@salesforce/apex/AccountSelector.saveFeedBack';
import { loadStyle } from 'lightning/platformResourceLoader';
import static_css_toast from '@salesforce/resourceUrl/static_css_toast';

export default class FeedBackForm extends LightningElement {
    handleCancel() {
        // Clear all input fields
        this.dispatchEvent(new CustomEvent('clearform'));
        // Optionally, scroll to top or close modal if needed
    }

    connectedCallback() {


        loadStyle(this, static_css_toast)
            .then(() => {
                console.log('CSS loaded successfully');
            //             this.dispatchEvent(new ShowToastEvent({
            // title: 'Feedback Form',
            // message: 'Please provide your feedback',
            // variant: 'info',mode: "sticky",
        // }));

            })
            .catch(error => {
                console.error('Error loading CSS:', error);
            });
    }

    handleSubmit(event){
        console.log('Submit button clicked');
        
        event.preventDefault(); // Prevent default form submission
        // Collect all input values
        const form = this.template.querySelector('form');
        const formData = new FormData(form);
        const fields = {};
        for (let [key, value] of formData.entries()) {
            fields[key] = value;
        }

        if (fields['name'] &&  fields['reason']) {

            let feedbackData =  JSON.stringify(fields);
            let feedBackJson = {}
            if(feedbackData.length > 50000){
                console.log('Feedback data is too long, splitting into two fields');
                
                feedBackJson.FeedBack_Data1__c = feedbackData.substring(0, 80000);
                feedBackJson.FeedBack_Data2__c = feedbackData.substring(80000, 160000);
            }else{
                feedBackJson.FeedBack_Data1__c = feedbackData;
                feedBackJson.FeedBack_Data2__c = '';
            }
            feedBackJson.Website_From__c ='portfolio feedback'


            saveFeedBack({feedBackJson : JSON.stringify(feedBackJson)})
            .then(result => {
                console.log('Feedback saved successfully:', result);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!',
                    message: 'Feedback submitted successfully',
                    variant: 'success'
                }));
                // Optionally, clear the form or perform other actions
                this.handleCancel();
            })
            .catch(error => {
                console.error('Error saving feedback:', error);
                console.error('Error saving feedback:', JSON.stringify(error));
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!',
                    message: 'Error in saving feedback',
                    variant: 'error'
                }));
            });


            
        }else{
            this.dispatchEvent(new ShowToastEvent({
                        title: 'Error!',
                        message: 'Please Fill all the required fields',
                        variant: 'error'
                    }))
        
            return;
        }
        // Perform any additional logic or validation here
        console.log('Form submitted with fields:', fields);
        // this.dispatchEvent(new CustomEvent('submitform', { detail: fields }));
    }

    handleChange(){

    }
}