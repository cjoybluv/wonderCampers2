export const char20 = (text) => {
  if (text.length<20) {
    return text;
  } else {
    text = text.replace('/',' ');
    return text.substring(0,text.substring(0,20).lastIndexOf(' '));
  }
 
}

export const prepareURL = (url) => {
  if (url.substring(0,4) !== 'http') {
    return 'http://'+url;
  } else {
    return url;
  }
}