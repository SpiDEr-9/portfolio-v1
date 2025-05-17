import { LightningElement, wire } from "lwc";
import { getRecord, updateRecord, createRecord } from "lightning/uiRecordApi";
import getVisitCount from "@salesforce/apex/AccountSelector.getVisitCount";
import updateVisitCount from "@salesforce/apex/AccountSelector.updateVisitCount";
import createVisitorIpReocrd from "@salesforce/apex/AccountSelector.createVisitorIpReocrd";
import getJobLists from "@salesforce/apex/AccountSelector.getJobLists";
import getVisitorsCountTillNow from "@salesforce/apex/AccountSelector.getVisitorsCountTillNow";
import getSfdcCerificationWrapper from "@salesforce/apex/AccountSelector.getSfdcCerificationWrapper";
import getIconsMetaData from "@salesforce/apex/AccountSelector.getIconsMetaData";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import test from "@salesforce/label/c.TEST_LABEL";
// Example :- import greeting from '@salesforce/label/c.greeting';

import DDF_PROJECT_SCREEN from "@salesforce/resourceUrl/ddf_screen_for_portfolio";
import CHROME_EXT_CODE_CVG from "@salesforce/resourceUrl/portfolio_chrome_ext_code_coverage";
import CHROME_EXT_CUSTOM_LABEL_FINDER from "@salesforce/resourceUrl/portfolio_chrome_ext_custom_label_finder";
import MY_IMAGE from "@salesforce/resourceUrl/bdm_passport_photo";
import SF_CERTI_LOGOS from "@salesforce/resourceUrl/sf_certification_logo";
const REQFIELDS = [
  "My_Site_Vist__c.Name",
  "My_Site_Vist__c.Portfolio_Visit__c",
];
export default class BhushanPortfolioLWC extends LightningElement {
  visitCounterRecordId = "a08GA00002DlFRw";
  myImage = MY_IMAGE;
  SF_CERTI_LOGOS = SF_CERTI_LOGOS;
  ddf_screen = DDF_PROJECT_SCREEN;
  chrome_ext_cc = CHROME_EXT_CODE_CVG;
  chrome_ext_clf = CHROME_EXT_CUSTOM_LABEL_FINDER;
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
  visitorCount = 0;

  scrollHandlerBound = null;
  scrollYNav = 0;

  scrollNavBarRemove;
  isEventListenerAdded = false;
  isMobileScreen = false;
  screenWidthEvent;
  certishow;
  certificaritionData;
  showFeedBackForm = true;


  handleConnectWithMeClick(event) {
    const clickedElement = event.currentTarget.dataset.name;
    this.showFeedBackForm = clickedElement == 'connectwithme' ? true : false;

}

closeFeedBackForm(){
    this.showFeedBackForm = false;
}

  checkAndClick() {
    const target = this.template.querySelector(
      `.job-div[data-id="${this.jobNames[0]}"]`
    );
    // const currentSection = this.template.querySelector('.animate-on-scroll');
    if (target && this.isInViewport(target)) {
      target.click();
      window.removeEventListener("scroll", this.scrollHandlerBound); // prevent repeated clicks
    }
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  renderedCallback() {
    console.log("rendercallback -- work" + test);

    const mainBody = this.template.querySelector(".main-body");
    if (!this.isFirstRender) {
      console.log("rendercallback -- work1111");
      this.isFirstRender = true;
      this.template.querySelector(".header")?.classList.add("display-flex");
    }
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.scrollNavBarRemove);
    window.removeEventListener("resize", this.checkScreenWidth.bind(this));
    window.removeEventListener(this.screenWidthEvent);
  }

  checkScreenWidth() {
    this.isMobileScreen = window.innerWidth <= 768;
    console.log(this.isMobile ? "Mobile view" : "Desktop view");
  }

  handleHamClick(event) {
    console.log("OUTPUT : ham click-- ", event.currentTarget.dataset.name);
    try {
      if (
        !this.template
          .querySelector(".menu")
          ?.classList?.contains("showHamMenue")
      ) {
        this.template.querySelector(".menu")?.classList.add("showHamMenue");
      } else {
        this.template.querySelector(".menu")?.classList.remove("showHamMenue");
      }
    } catch (error) {
      console.log("OUTPUT : ham click-- ", error);
      console.log("OUTPUT : ham click-- ", JSON.stringify(error));
    }
  }
  connectedCallback() {
    this.checkScreenWidth();
    this.screenWidthEvent = window.addEventListener(
      "resize",
      this.checkScreenWidth.bind(this)
    );

    getSfdcCerificationWrapper()
      .then((result) => {
        // this.certishow = `${this.SF_CERTI_LOGOS}/admin.png`
        if (result && result.length > 0) {
          let certifications = result.map((certi) => {
            return {
              ...certi,
              certiUrl: `${this.SF_CERTI_LOGOS}/${certi.static_resource_img_path__c}`,
            };
          });
          this.certificaritionData = certifications;
          logging(
            "OUTPUT : getSfdcCerificationWrapper",
            JSON.stringify(this.certificaritionData)
          );
        }
      })
      .catch((error) => {
        console.log("err : getSfdcCerificationWrapper", error);
        console.log("err : getSfdcCerificationWrapper", JSON.stringify(error));
      });

    console.log("OUTPUT : connectedCallback");
    try {
      this.scrollHandlerBound = this.checkAndClick.bind(this);
    } catch (error) {
      console.log("cc catch scroll--" + error);
      console.log("cc catch scroll--" + JSON.stringify(error));
    }

    window.addEventListener("scroll", this.scrollHandlerBound);

    this.scrollNavBarRemove = window.addEventListener("scroll", () => {
      if (window.scrollY < 75 && this.isMobileScreen) {
        this.template
          .querySelector(".header")
          ?.classList.add("position-relative");
        console.log("mobile add");
      } else if (window.scrollY > 75 && this.isMobileScreen) {
        console.log("mobile remove");
        this.template
          .querySelector(".header")
          ?.classList.remove("position-relative");
      }
      //   console.log('OUTPUT : scroll eventlistner'+window.scrollY+   '    -> '+this.scrollYNav);
      if (window.scrollY > this.scrollYNav) {
        // console.log('OUTPUT : scroll down');

        this.template.querySelector(".header")?.classList.add("hidden", "show");
        this.template
          .querySelector(".header")
          ?.classList.remove("display-flex");

        // console.log('down '+JSON.stringify(this.template.querySelector('.nav')?.classList));
      } else {
        // console.log('OUTPUT : scroll up');

        this.template
          .querySelector(".header")
          ?.classList.remove("hidden", "show");
        this.template.querySelector(".header")?.classList.add("display-flex");
        // console.log('up '+JSON.stringify(this.template.querySelector('.nav')?.classList));
      }
      setTimeout(() => {
        this.scrollYNav = window.scrollY;
      }, 2000);
    });

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

    getVisitorsCountTillNow()
      .then((result) => {
        //    console.log('OUTPUT : getVisitorsCountTillNow string', JSON.stringify(result));
        //    console.log('OUTPUT : getVisitorsCountTillNow', (result));
        this.visitorCount = result?.visitcount != null ? result?.visitcount : 0;
      })
      .catch((err) => {
        console.log("OUTPUT getJobLists: err ", err);
        console.log("OUTPUT getJobLists err: ", JSON.stringify(err));
      });
  }

  getVisitorLocation() {
    navigator?.geolocation?.getCurrentPosition((position) => {
      //   console.log('OUTPUT : position',position);
      //   console.log('OUTPUT : position',JSON.stringify(position));
      this.geoLocation = position;
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
        console.log(
          "OUTPUT : location longi-- ",
          this.geoLocation?.coords?.latitude
        );
        const fields = {
          Visitors_Device_Info__c: deviceInfo,
          Visitor_Number__c: this.currentVisit,
          Visitors_Ip__c: this.userIPAddress,
          Which_Site__c: "portfolio",
          Visitors_Location__Longitude__s: this.geoLocation?.coords?.longitude,
          Visitors_Location__Latitude__s: this.geoLocation?.coords?.latitude,
        };
        // console.log('OUTPUT : fields location obj'+JSON.stringify(fields));
        // const recordInput = {apiName: 'Site_Visit_Ip_Tracker__c',fields};
        createVisitorIpReocrd({ ipObj: JSON.stringify(fields) })
          .then((record) => {
            console.log("ip tracker Record created successfully. Id:", record);
          })
          .catch((error) => {
            let msg = error.body.message;
            let err = msg
              .substring(msg.indexOf(":"), msg.lastIndexOf(":"))
              .replace("&quot;", '"');

            this.dispatchEvent(
              new ShowToastEvent({
                title: "Error",
                message: err,
                variant: "error",
              })
            );

            //let test = this.error.replace("&quot;, ", "")
            // console.log('OUTPUT : test',test);

            console.log("Error creating ip tracker  record:", err);
            console.log("Error creating ip tracker  record:", err);
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

  handleJobClick(event) {
    event.preventDefault();

    const clickedElement = event.currentTarget;
    // console.log('OUTPUT : --- value-- ',clickedElement.dataset.id);
    let jobDescElement = this.template.querySelector(".job-description-info");
    jobDescElement.classList.remove("job-description-info");
    const border = this.template.querySelector(".active-border");

    const topOffset = clickedElement.offsetTop;
    const height = clickedElement.offsetHeight;
    // console.log('OUTPUT : offeset--',topOffset,' bottom  ', height);
    border.style.top = `${topOffset}px`;
    border.style.height = `${height}px`;

    void jobDescElement.offsetWidth; //void div.offsetWidth; forces a reflow, so the animation can start fresh.

    this.currentJobDetails = this.jobDetails[clickedElement.dataset.id];
    requestAnimationFrame(() => {
      jobDescElement.classList.add("job-description-info"); //requestAnimationFrame() waits for the DOM to update before reapplying the class.
    });

    const section = this.template.querySelector("#Experience").click(); // Change ID as needed
  }

  handleSocialLinkClick(event) {
    const socialLink = event.currentTarget.dataset.name;
    console.log("OUTPUT : social link-- ", socialLink);
    let urlMap = {
      github: "https://github.com/SpiDEr-9",
      linkedin: "https://www.linkedin.com/in/bdmhatre/",
      instagram: "https://www.instagram.com/bhushan_mhatre_45/",
    };

    if (urlMap[socialLink]) {
      window.open(urlMap[socialLink], "_blank");
    } else {
      console.error("URL not found for the clicked icon.");
    }
  }
}
