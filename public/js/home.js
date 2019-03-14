const slide = document.querySelector('.main-content_item-list');
const size = document.querySelector('.main-content_item').clientWidth;
let total = document.querySelectorAll('.main-content_item').length;
const pageSize = document.querySelector('.main-content_wrapper').clientWidth;
total = total - Math.floor(pageSize/size);
let count = 0;
function rightArrow(){
    if(count<total){
        slide.style.transition = 'transform 0.4s ease-in-out' ;
        count++;
        slide.style.transform = 'translatex('+(-size*count)+'px)';
    } 
}
function leftArrow(){
    if(count>0){
        slide.style.transition = 'transform 0.4s ease-in-out' ;
        count--;
        slide.style.transform = 'translatex('+(-size*count)+'px)';
    }
}