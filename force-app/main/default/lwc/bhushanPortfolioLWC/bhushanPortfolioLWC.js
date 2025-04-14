import { LightningElement, wire } from "lwc";
import { getRecord, updateRecord, createRecord } from "lightning/uiRecordApi";
import getVisitCount from "@salesforce/apex/AccountSelector.getVisitCount";
import updateVisitCount from "@salesforce/apex/AccountSelector.updateVisitCount";
import createVisitorIpReocrd from "@salesforce/apex/AccountSelector.createVisitorIpReocrd";
import getJobLists from "@salesforce/apex/AccountSelector.getJobLists";
import getIconsMetaData from "@salesforce/apex/AccountSelector.getIconsMetaData";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import MY_IMAGE from "@salesforce/resourceUrl/bdm_passport_photo";
const REQFIELDS = [
  "My_Site_Vist__c.Name",
  "My_Site_Vist__c.Portfolio_Visit__c",
];
export default class BhushanPortfolioLWC extends LightningElement {
  visitCounterRecordId = "a08GA00002DlFRw";
  myImage = MY_IMAGE;
  skills = [
    "Aura/LWC/VF Pages",
    "Apex/Triggers",
    "SOQL/SOSL",
    "REST & SOAP APIs",
    "Flows/Process Builder",
    "Admin Configuration",
    "Git & Version Control & DevOps",
    "VS Code with Salesforce Extensions",
  ];
  userIPAddress = "";
  currentVisit = 0;
  iconsHref = "";
  jobNames; //= ['Bajaj Finserv Ltd.','Globant','Amazon','Google']
  jobDetails = "";
  currentJobDetails = "";
  geoLocation = "";
  isFirstRender = false;
  socialIcons = "";
  observer;

  scrollHandlerBound = null


  checkAndClick() {
    const target  = this.template.querySelector(`.job-div[data-id="${this.jobNames[0]}"]`);
    if (target && this.isInViewport(target)) {
        target.click();
        window.removeEventListener('scroll', this.scrollHandlerBound); // prevent repeated clicks
    }
}

isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

  renderedCallback() {
    console.log("rendercallback -- work");

    const mainBody = this.template.querySelector(".main-body");
    if (!this.isFirstRender) {
      // let topJobDiv = this.template.querySelector(`.job-div[data-id="${this.jobNames[0]}"]`);
      // if (topJobDiv && this.isInViewport(topJobDiv)) {
      //     topJobDiv.click();
      //     // window.removeEventListener('scroll', this.checkAndClick.bind(this)); // prevent repeated clicks

      // }
      this.isFirstRender = true;
    }

    // if (!this.observer) {
    //     const options = {
    //       threshold: 0.3,
    //     };
  
    //     this.observer = new IntersectionObserver((entries) => {
    //       entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //           entry.target.classList.add('visible');
    //         }
    //       });
    //     }, options);
  
    //     this.template.querySelectorAll('.main-body').forEach(section => {
    //       this.observer.observe(section);
    //     });
    //   }
  }

  disconnectedCallback() {
    // Clean up
    // window.removeEventListener('scroll', this.checkAndClick.bind(this));
  }

  connectedCallback() {
    console.log("OUTPUT : connectedCallback");
    try {
        
        this.scrollHandlerBound = this.checkAndClick.bind(this)
    } catch (error) {
        console.log('cc catch scroll--'+error);
        console.log('cc catch scroll--'+JSON.stringify(error));
        
    }

    window.addEventListener('scroll', this.scrollHandlerBound);

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
      .then((result) => {
        // console.log('OUTPUT : ', JSON.stringify(result));
        this.currentVisit = result.Portfolio_Visit__c + 1;
        const fields = {
          Id: this.visitCounterRecordId,
          Portfolio_Visit__c: this.currentVisit,
        };
        updateVisitCount({ visitCountObj: JSON.stringify(fields) })
          .then(() => {
            this.updateVisitorsIp();
            // console.log('visit counter updated successfully');
          })
          .catch((error) => {
            // console.error('Error updating visit counter:', error);
          });
      })
      .catch((err) => {
        console.log("OUTPUT : ", JSON.stringify(err));
      });

    getJobLists()
      .then((result) => {
        this.jobDetails = result;
        this.jobNames = Object.keys(this.jobDetails);
      })
      .catch((err) => {
        console.log("OUTPUT getJobLists: err ", err);
        console.log("OUTPUT getJobLists err: ", JSON.stringify(err));
      });
  }

  getVisitorLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('OUTPUT : position',position);
      console.log('OUTPUT : position',JSON.stringify(position));
      this.geoLocation = (position);
    });
  }

  async updateVisitorsIp() {
    await this.getVisitorLocation();

    const Http = new XMLHttpRequest();
    const url = "https://api.ipify.org/";
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = () => {
      if (Http.readyState === 4 && Http.status === 200) {
        const deviceInfo = JSON.stringify({
          geoLocation: JSON.stringify(this.geoLocation),
          userAgent: navigator.userAgent,
          appCodeName: navigator.appCodeName,
          languages: navigator.languages,
          appName: navigator.appName,
        });
        this.userIPAddress = Http.responseText;
        console.log('OUTPUT : location longi-- ',this.geoLocation?.coords?.latitude );
        const fields = {
          Visitors_Device_Info__c: deviceInfo,
          Visitor_Number__c: this.currentVisit,
          Visitors_Ip__c: this.userIPAddress,
          Which_Site__c: "portfolio",
          Visitors_Location__Longitude__s: this.geoLocation?.coords?.longitude,
          Visitors_Location__Latitude__s : this.geoLocation?.coords?.latitude
        };
        console.log('OUTPUT : fields location obj'+JSON.stringify(fields));
        // const recordInput = {apiName: 'Site_Visit_Ip_Tracker__c',fields};
        createVisitorIpReocrd({ ipObj: JSON.stringify(fields) })
          .then((record) => {
            console.log('ip tracker Record created successfully. Id:', record);
          })
          .catch((error) => {

                    let msg = error.body.message
                    let err  = (msg.substring(msg.indexOf(":"),
                    msg.lastIndexOf(":"))).replace("&quot;", '"');

             this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: err,
                        variant: 'error'
                    }));
 
            //let test = this.error.replace("&quot;, ", "")
           // console.log('OUTPUT : test',test);


            console.log(
              "Error creating ip tracker  record:",
              err
            );
            console.log(
              "Error creating ip tracker  record:",
              err
            );
            console.log(
              "Error creating ip tracker  record:",
              JSON.stringify(err)
            );
          });

        // console.log('OUTPUT : ip address', this.userIPAddress + '     current visit -' + this.currentVisit);
      }
    };
  }

  handleLiHover(event) {
    // const liText = event.target.innerText;
    // const liHtml = event.target.innerHTML;

    // console.log('Hovered text:', liText);
    // console.log('Hovered HTML:', liHtml);
    const li = event.target;
    const text = li.innerText;
    var final = [];
    // const currentLi = this.template.querySelector(`.skills-li[data-skill=["${}"]`)
    const currentLi = this.template.querySelector(
      `.skills-li[data-skill="${text}"]`
    );

    // Prevent reprocessing if already animated
    if (li.querySelector("span")) return;

    li.innerHTML = ""; // Clear original text

    [...text].forEach((char, i) => {
      console.log("OUTPUT : ", char);
      const span = document.createElement("span");
      span.textContent = char;
      span.style.animationDelay = `${i * 0.05}s`;
      span.classList.add("typewriter-letter");
      // console.log('OUTPUT : ',span);
      final.push(span);

      li.appendChild(span);
    });

    console.log("OUTPUT : final", final);

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
    try {
        window.removeEventListener("scroll", this.scrollHandlerBound);
        
    } catch (error) {
        console.log("OUTPUT : event listner remove", error);
        console.log("OUTPUT : event listner remove", JSON.stringify(error));
        
    }
    const clickedElement = event.currentTarget;
    let jobDescElement = this.template.querySelector(".job-description-info");
    jobDescElement.classList.remove("job-description-info");
    const border = this.template.querySelector(".active-border");

    const topOffset = clickedElement.offsetTop;
    const height = clickedElement.offsetHeight;

    border.style.top = `${topOffset}px`;
    border.style.height = `${height}px`;

    // Optional: scroll into view
    clickedElement.scrollIntoView({ behavior: "smooth" });

    void jobDescElement.offsetWidth; //void div.offsetWidth; forces a reflow, so the animation can start fresh.

    this.currentJobDetails = this.jobDetails[clickedElement.dataset.id];
    requestAnimationFrame(() => {
      jobDescElement.classList.add("job-description-info"); //requestAnimationFrame() waits for the DOM to update before reapplying the class.
    });
    // console.log("OUTPUT : ", JSON.stringify(this.currentJobDetails));
  }
}