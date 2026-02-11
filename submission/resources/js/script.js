function updateLocationOptions(){
    const modality = document.getElementById("event_modality").value;

    const inPersonFields = document.getElementById("in_person_fields");
    const remoteFields = document.getElementById("remote_fields");
    const attendeesField = document.getElementById("attendees_field");


    //Default is to hide all three fields
    inPersonFields.classList.add("d-none");
    remoteFields.classList.add("d-none");
    attendeesField.classList.add("d-none");

    //depending on what is selected, remove hidden tag

    if (modality === "in_person") {
        inPersonFields.classList.remove("d-none");
        attendeesField.classList.remove("d-none");
    } else if (modality === "remote") {
        remoteFields.classList.remove("d-none");
        attendeesField.classList.remove("d-none");
    }
}

const events = [];
let currentEventId = null;
let nextId = 0;

function saveEvent(){
    const name = document.getElementById("event_name").value;
    const category = document.getElementById("event_category").value;
    const weekday = document.getElementById("event_weekday").value;
    const time = document.getElementById("event_time").value;
    const modality = document.getElementById("event_modality").value;
    const locationInput = document.getElementById("event_location").value;
    const remoteUrlInput = document.getElementById("event_remote_url").value;
    const attendees = document.getElementById('event_attendees').value.split(',').map(a => a.trim());

    let location = null;
    let remote_url = null;

    if (modality === "in_person") {
        location = locationInput;
    } else if (modality === "remote") {
        remote_url = remoteUrlInput;
    }


    if (currentEventId == null) {
        const eventDetails = {
            id: nextId++,
            name: name,
            category: category,
            weekday: weekday,
            time: time,
            modality: modality,
            location: location,
            remote_url: remote_url,
            attendees: attendees
        };
        events.push(eventDetails);
        console.log(events);

        addEventToCalendarUI(eventDetails);


    } else {
        const event = events.find(e => e.id === currentEventId);
        if (!event) return;

        event.name = name;
        event.category = category;
        event.weekday = weekday;
        event.time = time;
        event.modality = modality;
        event.location = location;
        event.remote_url = remote_url;
        event.attendees = attendees;

        const oldCard = document.querySelector(`[data-id='${currentEventId}']`);
        if (oldCard) {
            oldCard.remove();
        }

        addEventToCalendarUI(event);
    }
    
    document.getElementById('event_form').reset();

    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();
    currentEventId = null;
}

function addEventToCalendarUI(eventInfo){
    const dayId = eventInfo.weekday.toLowerCase();
    const daytoaddto = document.getElementById(dayId);

    let event_card = createEventCard(eventInfo);

    daytoaddto.appendChild(event_card);
}
function createEventCard(eventDetails){
    console.log("creating card");
    let event_element = document.createElement('div');
    event_element.classList = 'event row border rounded m-1 py-1';
    
    event_element.dataset.id = String(eventDetails.id);

    let info = document.createElement('div');

    event_element.addEventListener("click", function() {
        currentEventId = eventDetails.id;
        document.getElementById("event_name").value = eventDetails.name;
        document.getElementById("event_category").value = eventDetails.category;
        document.getElementById("event_weekday").value = eventDetails.weekday;
        document.getElementById("event_time").value = eventDetails.time;
        document.getElementById("event_modality").value = eventDetails.modality;
        document.getElementById("event_attendees").value = eventDetails.attendees.join(", ");

        updateLocationOptions();
        if (eventDetails.modality === "in_person") {
            document.getElementById("event_location").value = eventDetails.location;
            document.getElementById("event_remote_url").value = "";
        } else {
            document.getElementById("event_remote_url").value = eventDetails.remote_url;
            document.getElementById("event_location").value = "";
        }

        const myModalElement = document.getElementById("event_modal");
        const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
        myModal.show();
    });

    let locationInfo;

    if (eventDetails.modality === 'in_person') {
        locationInfo = eventDetails.location;
    } else {
        locationInfo = eventDetails.remote_url;
    }
    
    switch (eventDetails.category) {
        case 'School':
            event_element.classList.add('bg-danger', 'text-white');
            break;

        case 'Work':
            event_element.classList.add('bg-primary', 'text-white');
            break;

        case 'Personal':
            event_element.classList.add('bg-warning');
            break;

        default:
            event_element.classList.add('bg-light');
    }

    info.innerHTML = '<strong>' + 'Event Name: </strong>' + eventDetails.name + '<strong><br>' + 'Category: </strong>' + eventDetails.category + '<strong><br>' + 'Time: </strong>' + eventDetails.time + '<strong><br>' + 'Location: </strong>' + locationInfo + '<strong><br>' + 'Attendees: </strong>' + eventDetails.attendees.join(', ');

    event_element.appendChild(info);
    return event_element;
}