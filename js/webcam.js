localstream = null;
cancelXhr = false;
captureButton = document.getElementById('capture');
player = document.getElementById('vid');
player = null;
textExampleInput = document.getElementById('text-example');
imgExample = document.getElementById('example');
h2 = document.getElementById('h2');
h2.innerText = chrome.i18n.getMessage("h2_title");
document.getElementsByTagName('title').innerText = chrome.i18n.getMessage("h2_title");
console.log(chrome.i18n.getMessage("capture_button_text"));
$('#capture').text(chrome.i18n.getMessage("capture_button_text"));
var canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d');

GumHelper.startVideoStreaming(function callback(err, stream, videoElement, width, height) {
  if(err) {
    errorDiv = document.getElementById('error');
    errorDiv.innerText = chrome.i18n.getMessage("error");
    errorDiv.classList.add('visible');
  } else {
     
      player = videoElement;
      videoElement.id = 'vid';
      jQuery('.video-wrp-inner').prepend(videoElement);
      jQuery('.text-example-wrp').width(player.videoWidth - 60 )
      
      // (or you could just keep a reference and use it later)
  }
}, { timeout: 20000 });
 captureButton.addEventListener('click', () => {
    // Draw the video frame to the canvas.
    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;
    context.drawImage(player, 0, 0, player.videoWidth, player.videoHeight);
    canvasToDataURL = canvas.toDataURL();
    

			
			//var url= screenshot.url;
	var options= localStorage['options'],
        hr = $.ajax({
        url:'https://www.openscreenshot.com/upload3.asp',
        type:'post',
        data:{
            type:'png',
            title:"from my webcam",
            description:"From my webcam",
           // imageUrl:url,
            options:localStorage.options,
            data:canvasToDataURL
            //service:service
            },
        complete: function (a,b,c) {
            $('#topText').html('');
            if(cancelXhr) {
                $('#topText').text(chrome.i18n.getMessage("canceled")); return;
            }    
            /* Fixing the vulnerable that discovered by Google */
            var response = a.responseText.replace(/^\s+|\s+$/g,"");  // remove trailing white space
            if (/"/.test(response) || />/.test(response) || /</.test(response) || /'/.test(response) || response.indexOf("http:") != 0 ) {
                $("#topText").html('Please try again in some minutes. We are working to solve this issue.');
            } else {
                if(cancelXhr) {
                    return;
                }
                response = response.split(',');
                imageURL = response[0];
                onlineUrl = imageURL;
                imageDelete = response[1];
                chrome.runtime.sendMessage({action: "imageUrlCreated",url:imageURL});
                
            }

            }
        })
        $('#topText').html('<div class="dialog"><span class="uploading">' + chrome.i18n.getMessage("uploading") + '</span>' + 
        '<div class="spinner"><div class="double-bounce1"></div>' +
        '<div class="double-bounce2"></div></div>' +
        '<a href="#" id="a_cancel">' + chrome.i18n.getMessage("cancel") + '</a>' +
            '</div>').find('#a_cancel').click(function(){
            cancelXhr = true;
            hr.abort()
        });

  });
