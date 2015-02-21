function nCalendarClosure(el) {
	var calHolder = document.getElementById(el);
	
	var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var daysArray =[1,2,3,4,5,6,0];
	var selectDate = new Date();
	//var currentDate = selectDate;
	
	function renderCalendar(obj, date) {
		//console.log(obj);
		//remove if already rendered
		if (document.getElementById(el+'-calendar')!=undefined){
			document.getElementById(el+'-calendar').remove();
		}
		
		var selectMonth = date.getMonth();
		var selectYear = date.getFullYear();
		
		var calParent = document.createElement('div');
		calParent.className="calendar-parent";
		calParent.id = el+'-calendar';
		calHolder.appendChild(calParent);

		//close btn
		var calCloseBtn = document.createElement('div');
		calCloseBtn.className="details-box-request-close-btn icon";
		calCloseBtn.dataset.icon = '\uE00a';
		calCloseBtn.onclick = function() {
			document.getElementById(el+'-calendar').remove();
		};
		calParent.appendChild(calCloseBtn);

		var calContainer = document.createElement('div');
		calContainer.className="calendar-container";
		calParent.appendChild(calContainer);

		//prev month action
		var calPrevMonth = document.createElement('div');
		calPrevMonth.className="calendar-control-prev-month icon";
		calPrevMonth.dataset.icon = '\uE002';
		calPrevMonth.onclick = function() {
			date.setMonth(date.getMonth()-1);
			renderCalendar(obj, date);
		}
		calContainer.appendChild(calPrevMonth);

		var calMain = document.createElement('div');
		calMain.className="calendar-content";
		calContainer.appendChild(calMain);

		//add daysHeader
		var monthHeader = document.createElement('div');
		monthHeader.innerHTML=''+months[date.getMonth()] + ' ' + date.getFullYear();
		monthHeader.className="calendar-month-header";
		calMain.appendChild(monthHeader);

		//add daysHeader
		var daysWeek = document.createElement('div');
		daysWeek.className="calendar-week-block";
		calMain.appendChild(daysWeek);

		//add days
		for (var i=0; i < days.length; i++) {
			var calDay = document.createElement('div');
			calDay.innerHTML=days[i];
			calDay.className="calendar-day-block";
			daysWeek.appendChild(calDay);
		}
		
		//add dates
		var firstDate = new Date(selectYear, selectMonth, 1);
		var lastDate = new Date(selectYear, selectMonth+1, 0);

		//draw invalid dates of first week if any
		var dayCounter=0;
		for (dayCounter=0; dayCounter < 6; dayCounter++) {
			if (daysArray[dayCounter] == firstDate.getDay()) {
				break;
			}
			if (dayCounter==0) {
				var dateWeek = document.createElement('div');
				dateWeek.className="calendar-week-block";
				calMain.appendChild(dateWeek);
			}

			var calDate = document.createElement('div');
			calDate.className="calendar-nodate-block";
			dateWeek.appendChild(calDate);
		}
		
		for (var i=firstDate.getDate(); i <= lastDate.getDate(); i++) {
			if (dayCounter==7) {
				dayCounter=0;
			}
			if(dayCounter == 0){
				var dateWeek = document.createElement('div');
				dateWeek.className="calendar-week-block";
				calMain.appendChild(dateWeek);
			}
			var calDate = document.createElement('div');
			calDate.innerHTML=i;
			var value=''+i;
			
			if(i===date.getDate()) {
				calDate.className="calendar-date-block selected";
			} else {
				calDate.className="calendar-date-block";
			}
			dateWeek.appendChild(calDate);

			calDate.onclick = function(i) {
				return function() {
					var d = new Date('08/21/1988');
					d.setYear(date.getFullYear());
					d.setMonth(date.getMonth());
					d.setDate(i);

					selectDate = new Date(d);
					obj.innerHTML = d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear();
					document.getElementById(el+'-calendar').remove();
				}
			}(i);

			dayCounter++;
		}

		//next month action
		var calNextMonth = document.createElement('div');
		calNextMonth.className="calendar-control-next-month icon";
		calNextMonth.onclick = function() {
			date.setMonth(date.getMonth()+1);
			renderCalendar(obj, date);
		};
		calNextMonth.dataset.icon = '\uE003';
		calContainer.appendChild(calNextMonth);
	}
	
	return {
		select: function(obj) {
			renderCalendar(obj, new Date(selectDate));
		},
		hide: function(obj) {
			if (document.getElementById(el+'-calendar')!=undefined){
				document.getElementById(el+'-calendar').remove();
			}
		},
		getDate: function() {
			return selectDate;
		},
		getIsActive: function() {
			if (document.getElementById(el+'-calendar')!=undefined){
				return true;
			} else {
				return false;
			}
		}
	}
}