


$(document).ready(function(){

	var $body = $("body");
	var $search = $(".search");
	var $box = $(".box");
	var $set = $(".set");
	var $settings = $("header>div.settings i");
	var $main_container = $("main");
	var $main = $("main img");
	var $header = $("header");
	var $footer = $("footer");
	var $dialog = $(".dialog");
	var $control = $(".control");
	var $slider = $(".slider");
	var $thumb = $(".select>li");
	var $img = $(".select>li>img");
	var $right = $(".right");
	var $left = $(".left");
	var $play = $(".play");
	var $pause = $(".pause");


	var $timer;
	var $time_slide = 30000;
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var $count = $thumb.length;
	var $current = 0;
	var $shift=6;
	var $max_scroll;
	var $current_state;
	var $settings_state=0;

	function Clock(){
		Clock = setInterval(function(){
			if($timer==3){
				$header.fadeOut();
				$footer.fadeOut();
				$set.fadeOut();
				$search.fadeIn();
				$settings_state=0;
				$timer++;
			}
			else if($timer==7){
				$dialog.fadeOut();
			}
			else	
				$timer++;
		},1000);
	}

	function Date_Time(){
		Update_Time = setInterval(function(){
			var today = new Date();
			$date = " "+today.getDate()+" "+months[today.getMonth()]+", "+days[today.getDay()]+" ";
			$hours = today.getHours();
			if($hours<10){
				$hours="0"+$hours;
			}
			$min = today.getMinutes();
			if($min<10){
				$min="0"+$min;
			}
			$time = " "+$hours+":"+$min+" ";
			$("#date").text($date);
			$("#time").text($time);
		},1000);
	}

	function Reset_Clock(){
		$header.fadeIn();
		$footer.fadeIn();
		$dialog.fadeIn();
		$timer=0;
	}

	function Assign(){
		$img.eq(0).addClass("normal");
		var $width = $img.eq(0).prop("naturalWidth");
		var $height = $img.eq(0).prop("naturalHeight");
		if($width>$height)
			$main.addClass("landscape");
		else
			$main.addClass("potrait");
		$x = (0.5*parseFloat($main.css("width")))-200;
		$box.css("left",$x);
		$width = parseFloat($thumb.css("width"));
		var $sum = $count*$width;
		$slider.css("width",$sum);
		Max_Scroll($sum);	
	}

	function Max_Scroll($total){
		$max_scroll=-1*($total-parseFloat($main.css("width")));
	}

	function Change_img($n){
		$main.removeClass("potrait");
		$main.removeClass("landscape");
		var $src = $img.eq($n).attr("src");
		var $width = $img.eq($n).prop("naturalWidth");
		var $height = $img.eq($n).prop("naturalHeight");
		if($width>$height)
			$main.addClass("landscape");
		else
			$main.addClass("potrait");
		$main.fadeOut(function(){
			$main.attr("src",$src).on("load",function(){
				$main.fadeIn();
			});	
		});
		$img.eq($n).addClass("normal");
		if($current==($count-1))
			$current=-1;
	}

	function Next(){
		$img.eq($current).removeClass("normal");
		$current++;
		Change_img($current);
	}

	function Previous(){
		$img.eq($current).removeClass("normal");
		if($current==0){
			$current=$count-1;
			Change_img($current);
		}			
		else if($current==-1){
			$current=$count-2;
			Change_img($current);
		}	
		else{
			$current--;
			Change_img($current);
		}
	}

	function Change_state(){
		if($current_state==1){
			Stop();
			$play.removeClass("hide").addClass("display");
			$pause.removeClass("display").addClass("hide");
		}
		else{
			Start();
			$play.removeClass("display").addClass("hide");
			$pause.removeClass("hide").addClass("display");	
		}	
	}

	function Start(){
		$current_state=1;
		Change = setInterval(function(){
			$img.eq($current).removeClass("normal");
			$current++;
			Change_img($current);
		}, $time_slide);
	}

	function Stop(){
		$current_state=0;
		clearInterval(Change);
	}

	function Scroll_Left(){
		Slide_L = setInterval(function(){
			if(parseFloat($slider.css("left"))>$max_scroll){
					$slider.css("left","-="+$shift);
			}
			else{
				Stop_Scroll_Left();
			}
		},52);
	}

	function Scroll_Right(){
			Slide_R = setInterval(function(){
				if(parseFloat($slider.css("left"))<0){
					$slider.css("left","+="+$shift);
				}
				else{
					Stop_Scroll_Right();
				}	
			},52);
	}

	function Stop_Scroll_Left(){
		clearInterval(Slide_L);
	}

	function Stop_Scroll_Right(){
		clearInterval(Slide_R);
	}

	Clock();

	Date_Time();

	Assign();

	Start();

	$img.click(function(){
		if($current!=$img.index(this)){
			if($current_state==1){
				Stop();
				$img.eq($current).removeClass("normal");
				$current = $img.index(this);
				Change_img($current);
				Start();
			}
			else{
				$img.eq($current).removeClass("normal");
				$current = $img.index(this);
				Change_img($current);
			}
		}	
	});

	$play.click(function(){
		Change_state();
	});

	$pause.click(function(){
		Change_state();
	});

	$(document).keydown(function(e){
		if($current_state==1){
			if(e.keyCode==39){
				Stop();
				Next();
				Start();
			}
			else if(e.keyCode==37){
				Stop();
				Previous();
				Start();
			}
			else if(e.keyCode==32)
			{
				Change_state();
			}
		}
		else{
			if(e.keyCode==39){
				Next();
			}
			else if(e.keyCode==37){
				Previous();
			}
			else if(e.keyCode==32)
			{
				Change_state();
			}
		}	
	});

	$right.hover(Scroll_Left,Stop_Scroll_Left);

	$left.hover(Scroll_Right,Stop_Scroll_Right);

	$right.click(function(){
		if($current_state=1){
			Stop();
			Next();	
			Start();
		}
	});

	$left.click(function(){
		if($current_state=1){
			Stop();
			Previous();	
			Start();
		}
	});

	$right.mousemove(function(){
		$shift= 41-parseFloat($main.css("width"))+event.pageX;
	});

	$left.mousemove(function(){
		$shift= 41-event.pageX;
	});

	$(window).resize(function(){
		Max_Scroll(parseFloat($slider.css("width")));
	});

	$(document).mousemove(Reset_Clock).keydown(Reset_Clock);
	
	$(".form").submit(function() {
		$query = $(".form").attr("action")+$("#search").val();
		$(".form").attr("action",$query);
	});

	$(".form1").submit(function() {
		$time_slide = $("#timer").val();
		$slider.css("background",$("#color").val());
		Stop();
		Start();
		return false;
	});

	$settings.click(function(){
		if($settings_state==0){
			$search.fadeOut();
			$set.fadeIn();
			$settings_state=1;
		}	
		else{
			$set.fadeOut();
			$search.fadeIn();
			$settings_state=0;
		}	
	});

});




