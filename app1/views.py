from django.shortcuts import render
from django.http import HttpResponse
import base64
import time
import os
from . import faceRecog as fr
from app1.models import Man
from threading import Thread
from pathlib import Path
# Create your views here.


def index(request):
    return render(request, 'index.html')


def author(request):
    author_id = request.GET.get('id')
    text = '坐着id %s' % author_id
    return HttpResponse(text)


def signup(request):
    return render(request, 'signup.html')

def facetrain(request):
    if  request.method == "POST":
        user = request.POST.get('user')
        password = request.POST.get('pass')
        faceImgs = [request.POST.get('image0'), request.POST.get('image1'), request.POST.get('image2'), request.POST.get('image3'), request.POST.get('image4')]
        filePath = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        MEDIA_ROOT = os.path.join(filePath, "app1\\test\\")
        tPath = 'app1\\train\\' + user
        myTPath = os.path.join(filePath, tPath)
        tPath += '\\'
        trainPath = os.path.join(filePath, tPath)
        modelPath = os.path.join(filePath, "app1\\trained_knn_model1.clf")
        cnt = 1

        newUser = Man()
        newUser.name = user
        newUser.password = password
        newUser.time = ""
        newUser.save()

        for faceImage in faceImgs:
                index = faceImage.find('base64,')
                base64Str = faceImage[index + 6:]
                img = base64.b64decode(base64Str)
                backupDate = time.strftime("%Y%m%d_%H%M%S")
                fileName = MEDIA_ROOT + "%s%d.jpg" % (backupDate,cnt)
                file = open(fileName, 'wb')
                file.write(img)
                file.close()
                if not os.path.isdir(trainPath):
                        os.makedirs(trainPath)
                fileName = trainPath + "%s%d.jpg" % (backupDate,cnt)
                cnt = cnt + 1
                file = open(fileName, 'wb')
                file.write(img)
                file.close()
        print(myTPath)
        print(modelPath)
        thread = Thread(target = os.system('python app1/faceRecog.py'))
        thread.start()
        thread.join()
        return HttpResponse("Success")

def faceRecog(request):
    text = ""
    if request.method == "POST":
        pwd = request.POST.get("passwd")
        faceImage = request.POST.get("image")
        index = faceImage.find('base64,')
        base64Str = faceImage[index + 6:]
        img = base64.b64decode(base64Str)
        backupDate = time.strftime("%Y%m%d_%H%M%S")
        filePath = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        MEDIA_ROOT = os.path.join(filePath, "app1\\test\\")
        fileName = MEDIA_ROOT + "%s.jpg" % (backupDate)
        file = open(fileName, 'wb')
        file.write(img)
        file.close()
        modelpath = os.path.join(filePath, "app1\\trained_knn_model.clf")
        predictions = fr.predict(fileName,model_path=modelpath)

        for name, (top, right, bottom, left) in predictions:
            name = name.encode("UTF-8")
            text = name
        
        if text == "":
            return HttpResponse('Not Recognize')
        obj = Man.objects.all()
        username = text.decode()
        obj = obj.filter(name=username)
        for obj1 in obj:
            if obj1.password == pwd:
                return HttpResponse('success')
    return HttpResponse(text)