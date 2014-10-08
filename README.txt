To whom it may concerned,

This program implements code that allows the userCreate a service that tells
the user what types of food trucks might be found near a specific location on a map.
I use Python for the back end. I have not worked with Flask before but 
there was not too much things involved with the back-end so it not bother me.
I had not worked with Google Maps API experience, building the frontend was 
an interesting challenge to me. I tried to see tutorials as much as possible 
from the websites or StackOverflow. I didn't know dynamic updating markers 
on maps. Above things took me a lot of time to learn and study, Sorry 
about late submission, then below is some of my solutions:

	1. there is a little timer to let user stay until frontend can finish its data fetch
		in current viewport and specific zoom level.
	2. some location have much more truck locations than other locations. To make the results 
		looks more uniform and beautiful. The program divided up the current viewport into 
		four sections and choose a small number of food truck locations from each sections.
		
Put below command in the terminal to let the program run:
	python uber.py
You can see the result website which I host in Heroku:
   http://kuroangel.herokuapp.com/
SkillSet:
	Front End: JavaScript/jQuery/css/html/google map api
	Back End: Flask(Python)/Socrata
Best,

Fei