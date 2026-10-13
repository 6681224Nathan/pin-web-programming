Output shows the JSON data on the web browser by calling the URL.
Example 
1) GET http://localhost:3000/courseid/:courseid
	 	Request http://localhost:3000/courseid/egci111
		Response [
      					{ name: "Bob", courseid: "egci111", coursename: "computer programming", mark: 80 },
    						{ name: "Tom", courseid: "egci111", coursename: "computer programming", mark: 50 }
    				]

2) GET http://localhost:3000/gtmark/:mark
		Request http://localhost:3000/gtmark/70
		Response [
      					{ name: "Bob", courseid: "egci111", coursename: "computer programming", mark: 80 },
    						{ name: "Sue", courseid: "egci427", coursename: "web programming", mark: 90 }
    				]

3) PUT http://localhost:3000/updatename/:name
		Request http://localhost:3000/updatename/Bob
						Body Message { name: "Tim" }
		Response { name: "Tim", courseid: "egci111", coursename: "computer programming", mark: 80 }

4) POST http://localhost:3000/addstudent
		Request http://localhost:3000/addstudent
						Body Message { name: "Mary", courseid: "egci427", coursename: "web programming", mark: 85 }
		Response { name: "Mary", courseid: "egci427", coursename: "web programming", mark: 85 }
//--------------------------------//
//.env
  PORT=3000
  MONGO_URI=mongodb://localhost:27017/egci427