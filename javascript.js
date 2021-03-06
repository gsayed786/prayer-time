
var app = (function( doc ) {

    var component = {
        data: null,
        fetchUrl: 'http://localhost:8888/practice/namazProject/prayer-timings.json',
        currentTime: null,
        currentTimeHS : null,
        months: [],

        /**
         * Job of this function is to call fetch method func and ready method function
         */
        init: function() {
            component.fetch();
            setTimeout( component.ready, 400 );
            setInterval( component.clock, 1000*60 );
        },

        /**
         * Ready method function will be called after 400 milliseconds.
         */
        ready: function() {
            component.monthSelector = document.getElementById( 'select-month');

            component.azan = document.getElementById( 'azan-audio');
            component.showAllMonths();
            component.updateCurrentDay();

            component.monthSelector.addEventListener( 'change', function ( event ) {
                component.updateMonth( event.target.value );
            }, false );


        },

        fetch: function() {
            var request = new XMLHttpRequest();

            request.open( 'POST', component.fetchUrl );

            request.onload = function() {
                component.data = JSON.parse( request.response );
            };

            request.send(); // component.data gives the entire object of prayer timings
        },

        showAllMonths : function() {
            var monthsArray, markup = '', monthName, monthObject,
                dateRangeObj, date, maxI, trId, currentDate,
                trTableHead = doc.getElementById( 'table-head-row' );

            /**
             * Will give all the property name of the object in an array ( the left part which is key ).
             */
            monthsArray = Object.keys( component.data );

            for( var index in monthsArray ) {
                monthName = monthsArray[ index ];
                monthObject = component.data[ monthName ];
                component.months.push( monthName );

                for ( var dateRange in monthObject.dates ) {
                    dateRangeObj = monthObject.dates[ dateRange ];
                    date = parseInt( dateRange , 10 );
                    maxI = 25 === date ? ( parseInt( monthObject.days, 10 ) - date ) : 3;

                    for( var i = 0; i <= maxI ; i++ ) {
                        currentDate = date + i;
                        trId = monthName + currentDate;

                        markup += '<tr id="'+ trId +'" class ="trElement ' + monthName + '" >';

                        markup += '<td class="prayer-month" >' + monthName + '</td>';
                        markup += '<td class="prayer-date">' + currentDate + '</td>';

                        for ( var prayerName in dateRangeObj ) {
                            var prayerTime = dateRangeObj[ prayerName ];
                            markup += '<td class="prayer-time">' + prayerTime + '</td>';
                        }

                        markup += '</tr>';
                    }
                }
            }

            trTableHead.insertAdjacentHTML( 'afterend', markup );
        },

        updateMonth: function( monthName ) {
            var trAll = document.querySelectorAll( '.trElement' ),
                monthElement = document.querySelectorAll( '.' + monthName );

            for ( var i = 0 ; i < trAll.length; i++ ){
                trAll[ i ].classList.add( 'hidden' );
            }

            for ( var j = 0 ; j < monthElement.length; j++ ) {
                monthElement[ j ].classList.remove('hidden');
            }
        },

        updateCurrentDay : function () {
            var date = new Date(), today, month, monthName, todayRow;

            today = date.getDate();
            month = date.getMonth();
            monthName = component.months[ month ];
            component.updateMonth( monthName );
            component.monthSelector.value = monthName;

            todayRow = document.getElementById( monthName + today );
            todayRow.classList.add( 'current-date' );
        },

        /**
         * Checks and create time string.
         */
        clock: function() {
            var date = new Date();

            component.createTimeString( date );
            document.querySelector( '.currentTime' ).innerHTML = component.currentTime;

            component.checkTime( date );
        },

        createTimeString: function( date ) {
            var addZeroPrefix, changeHrWindow, h, m, s;

            addZeroPrefix = function( i ) {
                return i < 10 ? ('0' + i)  : i;
            };

            h = addZeroPrefix( date.getHours() ) ;
            m = addZeroPrefix( date.getMinutes() );
            s = addZeroPrefix( date.getSeconds() );

            if( 12 <= h ){
                h = h - 12 ;
            }
            component.currentTimeHS = h + ":" + m;
            component.currentTime = h + ":" + m + ":" + s;

        },

        checkTime: function( date ) {
            var today = date.getDate(),
                currentMonth = date.getMonth(),
                monthName = component.months[ currentMonth ],
                timeTds = document.querySelectorAll( '#' + monthName + today + ' .prayer-time' ),
                td, time, currentTime;

            for ( var i = 0; i < timeTds.length; i++ ) {
                td = timeTds[ i ];
                time = td.textContent;
                currentTime = component.getCurrentTime( date );

                if ( time === currentTime ){
                    component.azan.play();
                }
            }
        },

        getCurrentTime: function( date ) {
            var hour = date.getHours(),
                minutes = date.getMinutes();

            hour = hour > 12 ? hour - 12 : hours;
            return hour + ':' + minutes;
        }
    };

    return component;

})( document );

app.init();
