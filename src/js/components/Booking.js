import { select, settings, templates, classNames } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking{
  constructor(element) {
    const thisBooking = this;

    thisBooking.element = element;
    thisBooking.selected = null;

    thisBooking.render(element);
    thisBooking.initWidget();
    thisBooking.getData();

  }

  getData() {
    const thisBooking = this;

    const startDateParams = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParams = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    
    //console.log(utils.dateToStr(thisBooking.datePicker.minDate))

    const params = {
      booking: [
        startDateParams,
        endDateParams,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParams,
        endDateParams,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParams,
      ],
    };

  //  console.log('getData params', params);

    const urls = {
      bookings:      settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.events + '?' + params.eventsRepeat.join('&'),
    };

  //  console.log('getData urls', urls);

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
      //  console.log('bookingsResponse', bookingsResponse);
        const eventsCurrentResponse = allResponses[1];
      //  console.log('eventsCurrentResponse', eventsCurrentResponse);
        const eventsRepeatResponse = allResponses[2];
      //  console.log('eventsRepeatResponse', eventsRepeatResponse);
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([booking, eventsCurrent, eventsRepeat]) {
      //  console.log('booking', booking);
      //  console.log('eventsCurrent', eventsCurrent);
      //  console.log('eventsRepeat', eventsRepeat);
      });
  }  
  

  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);
  
    thisBooking.dom.listTable = document.querySelector(select.booking.allTable);
    thisBooking.dom.tables = document.querySelectorAll(select.booking.tables);
    
  }

  initWidget() {
    const thisBooking = this;

    thisBooking.amountPeople = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.amountHours = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(this.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.listTable.addEventListener('click', function(event) {
      thisBooking.initTables(event);
    });
  }

  initTables(event) {
    const thisBooking = this;

    const tableObj = event.target;
    event.preventDefault();
    const tableObjId = tableObj.getAttribute(settings.booking.tableIdAttribute);
  
    const tableSelected = classNames.booking.tableSelected;

    if(tableObjId) {
      if(tableObj.classList.contains(tableSelected)) {
        alert('stolik zajęty');
      } else {
        for(const table of thisBooking.dom.tables) {
          if(table.classList.contains(tableSelected) && table !== tableObj) {
            table.classList.remove(tableSelected);
          }
        }
        thisBooking.selected = tableObjId;
        tableObj.classList.add(tableSelected);
      }
    }
  }
}  

export default Booking;