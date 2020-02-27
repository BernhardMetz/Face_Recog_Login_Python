window.onload = function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, { camera: true });

    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function(rect) {

            //$("#btn_capture").enable();
        });
    });
};
$(document).ready(function(){
    var cnt = 0;
    var arr_img = new Array;
    $("#btn_submit").click(function () {
        if (cnt < 5)
        {
            alert("Please capture 5 photos of your own.");
            return;
        }
        var username = $("#user").val();
        var password = $("#pass").val();
        var rpass = $("#rpass").val();
        if (username == "")
        {
            alert("Please enter username.");
            return;
        }
        if (rpass != password)
        {
            alert("Please enter password correctly.");
            $("#pass").val("")
            $("#rpass").val("")
            return;
        }
        document.getElementById('photo').textContent = "Now training your face... Please wait for a while.";
        $.ajax({
            contentType : "application/x-www-form-urlencoded; charset=utf-8",
            type : "post",
            url : "/facetrain/",
            async: true, 
            data : {
                csrfmiddlewaretoken : token,
                image0 : arr_img[0],
                image1 : arr_img[1],
                image2 : arr_img[2],
                image3 : arr_img[3],
                image4 : arr_img[4],
                user : username,
                pass : password,
            },
            success : function(result) {
                document.getElementById('photo').textContent = "Congratulation! You have signed up successfully.";
                location.href = "/"
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
    
    $("#btn_capture").click(function () {
        if (++cnt < 6)
        {
            var video = document.getElementById('video');
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            token = $("input[name='csrfmiddlewaretoken']").val();
            var tempSrc = canvas.toDataURL("image/png");
            arr_img[cnt-1] = tempSrc;
            var newImg = document.createElement('img');
            newImg.setAttribute('src', arr_img[cnt-1]);
            newImg.style.height = '80px';
            newImg.style.padding = '5px 5px 5px 0px';
            var currentDiv = document.getElementById("div2"); 
            currentDiv.appendChild(newImg);
        }
    });
});

