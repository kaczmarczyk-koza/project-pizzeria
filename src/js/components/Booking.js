import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking{
    constructor(element) {
        const thisBooking = this;

        thisBooking.element = element;
        thisBooking.render(element);
        thisBooking.initWidget();
    }

    render(element) {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();

        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    }

    initWidget() {
        const thisBooking = this;

        thisBooking.amountPeople = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.amountHours = new AmountWidget(thisBooking.dom.hoursAmount);
    }
}

export default Booking;