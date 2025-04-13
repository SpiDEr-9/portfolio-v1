import { LightningElement, wire } from 'lwc';
import { getRecord, updateRecord, createRecord } from 'lightning/uiRecordApi';
import getVisitCount from '@salesforce/apex/AccountSelector.getVisitCount';
import updateVisitCount from '@salesforce/apex/AccountSelector.updateVisitCount';
import createVisitorIpReocrd from '@salesforce/apex/AccountSelector.createVisitorIpReocrd';
import getJobLists from '@salesforce/apex/AccountSelector.getJobLists';
import getIconsMetaData from '@salesforce/apex/AccountSelector.getIconsMetaData';

import MY_IMAGE from '@salesforce/resourceUrl/bdm_passport_photo';
const REQFIELDS = ['My_Site_Vist__c.Name', 'My_Site_Vist__c.Portfolio_Visit__c']
export default class BhushanPortfolioLWC extends LightningElement {
  visitCounterRecordId = 'a08GA00002DlFRw';
  myImage = MY_IMAGE;
  skills = ['Aura/LWC/VF Pages', 'Apex/Triggers', 'SOQL/SOSL', 'REST & SOAP APIs', 'Flows/Process Builder', 'Admin Configuration', 'Git & Version Control & DevOps', 'VS Code with Salesforce Extensions']
  userIPAddress = ''
  currentVisit = 0
  iconsHref = ''
  jobNames //= ['Bajaj Finserv Ltd.','Globant','Amazon','Google']
    jobDetails = ''
    currentJobDetails = ''
    geoLocation = ''
    isFirstRender = false
    socialIcons =''

  renderedCallback() {
    const mainBody = this.template.querySelector('.main-body');
    if (!this.isFirstRender) {
        this.template.querySelector(`.job-div[data-id="${this.jobNames[0]}"]`).click();
        this.isFirstRender = true;
        // this.socialIcons.forEach(icon => {
        //     const liEl = this.template.querySelector(`li[data-id="${icon.Id}"]`);
        //     if (liEl) {
        //       liEl.innerHTML = icon.SVG__c;
        //     }
        //   });
        
        }

  }


  constructor() {
    
    console.log('Constructor called');
}


  connectedCallback() {
    console.log('connectedCallback called');
    // getIconsMetaData()
    //       .then(result => {
    //         // console.log('OUTPUT : ', JSON.stringify(result));
    //         this.iconsHref = result
    //         this.socialIcons  = result

            


    //         console.log('OUTPUT : getIconsMetaData', JSON.stringify(result));
    //       }).catch(err => {

    //         console.log('OUTPUT : ', JSON.stringify(err));
    //       })
    // console.log('OUTPUT : cc---', this.visitCounterRecordId);
    getVisitCount({ visitId: this.visitCounterRecordId })
      .then(result => {
        // console.log('OUTPUT : ', JSON.stringify(result));
        this.currentVisit = result.Portfolio_Visit__c + 1;
        const fields = { Id: this.visitCounterRecordId, Portfolio_Visit__c: (this.currentVisit) };
        updateVisitCount({ visitCountObj : JSON.stringify(fields) })
          .then(() => {
            this.updateVisitorsIp()
            // console.log('visit counter updated successfully');
          })
          .catch(error => {
            // console.error('Error updating visit counter:', error);
          });

      }).catch(err => {

        console.log('OUTPUT : ', JSON.stringify(err));
      })
      


      getJobLists().then(result => {
        this.jobDetails = result;
        this.jobNames = Object.keys(this.jobDetails);
      }).catch(err => { 
        console.log('OUTPUT getJobLists: err ', (err));
        console.log('OUTPUT getJobLists err: ', JSON.stringify(err));
        
      })


  }

  getVisitorLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        this.geoLocation = JSON.stringify(position);
      });
  }

  async updateVisitorsIp() {
    await this.getVisitorLocation();

    const Http = new XMLHttpRequest();
    const url = 'https://api.ipify.org/';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = () => {

       
          
            
      if (Http.readyState === 4 && Http.status === 200) {
        const deviceInfo =  JSON.stringify({
        geoLocation :  this.geoLocation,    userAgent: navigator.userAgent,
      appCodeName   : navigator.appCodeName,
      languages: navigator.languages,
      appName: navigator.appName})
        this.userIPAddress = Http.responseText;

        const fields = { Visitors_Device_Info__c : deviceInfo , Visitor_Number__c: this.currentVisit, Visitors_Ip__c: this.userIPAddress, Which_Site__c: 'portfolio' };
        // const recordInput = {apiName: 'Site_Visit_Ip_Tracker__c',fields};
        createVisitorIpReocrd({ ipObj: JSON.stringify(fields) })
          .then(record => {
            // console.log('ip tracker Record created successfully. Id:', record);
          })
          .catch(error => {
            console.error('Error creating ip tracker  record:', error.body.message);
            console.error('Error creating ip tracker  record:', JSON.stringify(error));
          });

        // console.log('OUTPUT : ip address', this.userIPAddress + '     current visit -' + this.currentVisit);
      }
    }
  }


  handleLiHover(event) {
    // const liText = event.target.innerText;
    // const liHtml = event.target.innerHTML;

    // console.log('Hovered text:', liText);
    // console.log('Hovered HTML:', liHtml);
    const li = event.target;
    const text = li.innerText;
    var final = []
    // const currentLi = this.template.querySelector(`.skills-li[data-skill=["${}"]`)
    const currentLi = this.template.querySelector(`.skills-li[data-skill="${text}"]`)


    // Prevent reprocessing if already animated
    if (li.querySelector('span')) return;

    li.innerHTML = ''; // Clear original text

    [...text].forEach((char, i) => {
    //   console.log('OUTPUT : ', char);
      const span = document.createElement('span');
      span.textContent = char;
      span.style.animationDelay = `${i * 0.05}s`;
      span.classList.add('typewriter-letter');
      // console.log('OUTPUT : ',span);
      final.push(span);

      li.appendChild(span);
    });

    console.log('OUTPUT : final', final);

    // You can also store or use this text however you want
  }


  handleMouseOut(event) {

    const liText = event.target.innerText;
    // const liHtml = event.target.innerHTML;
  }


//   handleJobClick(event){
//     let selectedJob = event.currentTarget.dataset.id;
//     let allJobs = this.template.querySelectorAll('.job-div');
//     allJobs.forEach(job=>{
//       let cssClasses = JSON.stringify(job.classList);
//       if(cssClasses.includes('selected-job') && job.dataset.id != selectedJob){
//         job.classList.remove('selected-job');
//       }
//     })

//     this.template.querySelector(`.job-div[data-id="${selectedJob}"]`).classList.add('selected-job');
//     let jobDescElement = this.template.querySelector('.job-description-info');
//     jobDescElement.classList.remove('job-description-info');
//     jobDescElement.classList.add('job-description-info');
//   }

  // handleMouseOver() {
  //   const items = this.template.querySelectorAll('.about-skills li');
  //   items.forEach((li) => {
  //     // li.classList.add('hovered');
  //     console.log('OUTPUT : hovered----'+JSON.stringify(li));
  //     console.log('OUTPUT : hovered----'+JSON.stringify(li.innerHTML));
  //     console.log('OUTPUT : hovered----'+JSON.stringify(li.innerText));
  //   });
  // }

  // handleMouseOut() {
  //   const items = this.template.querySelectorAll('.about-skills li');
  //   items.forEach((li) => {
  //     // li.classList.remove('hovered');
  //     console.log('OUTPUT : OUT----'+JSON.stringify(li.innerText));
  //     console.log('OUTPUT : OUT----'+JSON.stringify(li.innerHTML));
  //   });
  // }


  handleJobClick(event) {
      const clickedElement = event.currentTarget;
      let jobDescElement = this.template.querySelector('.job-description-info');
      jobDescElement.classList.remove('job-description-info');
    const border = this.template.querySelector('.active-border');

    const topOffset = clickedElement.offsetTop;
    const height = clickedElement.offsetHeight;

    border.style.top = `${topOffset}px`;
    border.style.height = `${height}px`;

    // Optional: scroll into view
    clickedElement.scrollIntoView({ behavior: 'smooth'});
    
    void jobDescElement.offsetWidth; //void div.offsetWidth; forces a reflow, so the animation can start fresh.


    this.currentJobDetails = this.jobDetails[clickedElement.dataset.id];
    requestAnimationFrame(() => {
        jobDescElement.classList.add('job-description-info'); //requestAnimationFrame() waits for the DOM to update before reapplying the class.
      });
    console.log('OUTPUT : ', JSON.stringify(this.currentJobDetails));
    
  }
}