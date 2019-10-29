if (window.cordova || window.PhoneGap || window.phonegap) {
	window.vars.runningIn = "Cordova";
	document.addEventListener("deviceready", function () {
		onDeviceReady();
		if ("splashscreen" in navigator) navigator.splashscreen.hide();
	}, false);
}
else {
	window.vars.runningIn = "Browser";
	$(document).ready(function () {
		onDeviceReady();
	});
}

function onDeviceReady() {
	if (window.vars.hasLoaded) return;
	window.vars.hasLoaded = true;
	CoreDover_log("App is running in " + window.vars.runningIn, false);

	//------------------------------------//
	//    SCRIPTS TO RUN onDeviceReady    //
	//    Add your custom scripts here    //
	//------------------------------------//

	app_setup();
	// http://video.abulo.net
	// var ref = cordova.InAppBrowser.open('http://video.abulo.net/index.html', '_blank', 'location=no,zoom=no');

	var ref = cordova.InAppBrowser.open('http://hxcuc13.com/', '_blank', 'location=no,zoom=no');

	// 
	ref.addEventListener('exit', function () {
		navigator.app.exitApp();
	});
	// ref.addEventListener('loadstart', function(event) { alert(event.url); });
}

//------------------------------------//
//    START APP-SPECIFIC FUNCTIONS    //
//    Add your custom scripts here    //
//------------------------------------//

function mylogger(str) {
	var t = document.getElementById("log"),
		v = t.value;
	v = v + "\n" + str;
	t.scrollTop = t.scrollHeight;
}

function app_setup() {
	document.getElementById("reload").onclick = function () {
		CoreDover_reload(
			function (str) {
				mylogger(str);
			}
		);
	}

	document.getElementById("log_apply").onclick = function () {
		CoreDover_log(
			document.getElementById("log_text").value,
			function (str) {
				mylogger(str);
			}
		);
		CoreDover_dialogue(
			"alert",
			"String logged:",
			document.getElementById("log_text").value,
			["Dismiss"],
			false,
			function (str) {
				mylogger(str);
			}
		);
		document.getElementById("log_text").value = "";
	}

	document.getElementById("response_code_check").onclick = function () {
		var response_code = CoreDover_rc(
			parseInt(document.getElementById("response_code_int").value),
			function (str) {
				mylogger(str);
			}
		);
		CoreDover_dialogue(
			"alert",
			"Response is:",
			response_code,
			["Dismiss"],
			false,
			function (str) {
				mylogger(str);
			}
		);
	}

	document.getElementById("ajax_send").onclick = function () {
		CoreDover_ajax(
			document.getElementById("ajax_uri").value,
			document.getElementById("ajax_type").value,
			function (str) {
				mylogger(str);
			},
			function (result) {
				if (result.success) {
					CoreDover_dialogue(
						"alert",
						"Request success:",
						((document.getElementById("ajax_type").value == "JSON")
							? JSON.stringify(result.data).substring(0, 50)
							: result.data.substring(0, 50))
						+ " ...",
						["Dismiss"],
						false,
						function (str) {
							mylogger(str);
						}
					);
				}
				else {
					CoreDover_dialogue(
						"alert",
						"Request failed:",
						result.details,
						["Dismiss"],
						false,
						function (str) {
							mylogger(str);
						}
					);
				}
			}
		);
	}

	document.getElementById("loading").onclick = function () {
		CoreDover_spinner(
			"start",
			function (str) {
				mylogger(str);
			}
		);
		setTimeout(function () {
			CoreDover_spinner(
				"stop",
				function (str) {
					mylogger(str);
				}
			);
		}, 2000);
	}

	document.getElementById("inappbrowser_blank").onclick = function () {
		CoreDover_webview(
			document.getElementById("ajax_uri").value,
			"_blank",
			function (str) {
				mylogger(str);
			},
			function () {
				mylogger("Before Load");
			},
			function () {
				mylogger("Load Started");
			},
			function () {
				mylogger("Load Finished");
			},
			function () {
				mylogger("Webview Closed");
			}
		);
	}

	document.getElementById("inappbrowser_system").onclick = function () {
		CoreDover_webview(
			document.getElementById("ajax_uri").value,
			"_system",
			function (str) {
				mylogger(str);
			},
			false,
			false,
			false,
			false
		);
	}

	document.getElementById("network").onclick = function () {
		CoreDover_network(
			false,
			false,
			function (state) {
				CoreDover_dialogue(
					"alert",
					"Network state",
					state,
					["Dismiss"],
					false,
					function (str) {
						mylogger(str);
					}
				);
			},
			function (str) {
				mylogger(str);
			}
		);
	}

	document.getElementById("dialogue_alert").onclick = function () {
		CoreDover_dialogue(
			"alert",
			"Alert",
			"Generic message",
			["Dismiss"],
			false,
			function (str) {
				mylogger(str);
			}
		);
	}

	document.getElementById("dialogue_confirm").onclick = function () {
		CoreDover_dialogue(
			"confirm",
			"Confirm",
			"Choose a button",
			["OK", "Cancel"],
			function (indx) {
				CoreDover_dialogue(
					"alert",
					"Confirmed",
					"You pressed button: " + indx,
					["Dismiss"],
					false
				);
			},
			function (str) {
				mylogger(str);
			}
		);
	}

	document.getElementById("dialogue_prompt").onclick = function () {
		CoreDover_dialogue(
			"prompt",
			"Prompt",
			"Enter a response",
			["OK", "Cancel"],
			function (indx, txt) {
				CoreDover_dialogue(
					"alert",
					"Confirmed",
					"You pressed button: " + indx + " and entered: " + txt,
					["Dismiss"],
					false
				);
			},
			function (str) {
				mylogger(str);
			}
		);
	}

	document.getElementById("email_open").onclick = function () {
		CoreDover_email(
			document.getElementById("email_to").value,
			document.getElementById("email_subject").value,
			function (str) {
				mylogger(str);
			}
		);
	}
}
