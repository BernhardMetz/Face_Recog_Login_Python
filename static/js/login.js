
window.onload=function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, {camera: true});

    tracker.on('track', function (event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0);
        event.data.forEach(function (rect) {
            //tracker.stop();
            //tracker.run();
            //检测到脸
            // $("#khb").hide();

        });
    });
}

$(function(){
    $("#btn-login").click(function(){
        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        token = $("input[name='csrfmiddlewaretoken']").val();
        var tempSrc = canvas.toDataURL("image/png");
        password = $('#pass').val();
        $.ajax({
            contentType : "application/x-www-form-urlencoded; charset=utf-8",
            type : "post",
            url : "facerecog/",
            async: true,
            data : {
                csrfmiddlewaretoken : token,
                image : tempSrc,
                passwd : password,
            },
            success : function(result) {
                if (result == 'success')
                    location.href = "https://baidu.com"
                else
                {
                    $("#user").val(result);
                    $("#pass").val("");
                    alert("Wrong user or password! Please try again.")
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $("#btn-signup").click(function(){
        location.href="signup"
    });
});
