/*! window.performance.now
http://opensource.org/licenses/MIT
Copyright Paul Irish 2015 */
!function(){if("performance"in window==0&&(window.performance={}),Date.now=Date.now||function(){return(new Date).getTime()},"now"in window.performance==0){var n=Date.now();performance.timing&&performance.timing.navigationStart&&(n=performance.timing.navigationStart),window.performance.now=function(){return Date.now()-n}}}();