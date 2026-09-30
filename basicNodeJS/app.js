	function helloWorld(){
		console.log("Hello World");
	}


	console.log(__filename);
	console.log(__dirname);
	var t=setTimeout(helloWorld, 3000);
	//clearTimeout(t);
	
	var i =0;
	var Counter = setInterval(counter,2000);
	function counter(){
		i++;
		console.log(i);
	}
	setTimeout(function()
	{
		clearInterval(Counter);
	},10000);

	var crypto=require('crypto');
var fs=require('fs');
var shasum = crypto.createHash('sha1');
var s = fs.ReadStream('file.txt');
s.on('data',function(d) {
shasum.update(d);
});
s.on('end',function() {
var d = shasum.digest('hex');
console.log(d+' => file.txt');
});
