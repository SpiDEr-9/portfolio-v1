import { LightningElement } from 'lwc';
export default class FeedBackForm extends LightningElement {
    handleCancel() {
        // Clear all input fields
        this.dispatchEvent(new CustomEvent('clearform'));
        // Optionally, scroll to top or close modal if needed
    }
}