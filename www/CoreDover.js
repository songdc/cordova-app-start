window.vars = {};
window.vars.inithref = window.location.href;
window.vars.hasLoaded = false;

function CoreDover_reload(loggercb) {
    CoreDover_log("Reloading main webview", loggercb);
    if ("vars" in window) {
        if ("inithref" in window.vars) {
            window.location.href = window.vars.inithref;
            return;
        }
    }
    window.location.reload();
}

function CoreDover_log(msg, callback) {
    console.log(msg);
    if (callback) {
        var d = new Date(),
            day = d.getDate(),
            month = d.getMonth() + 1,
            year = d.getFullYear(),
            hour = d.getHours(),
            mins = d.getMinutes(),
            secs = d.getSeconds(),
            str = day + "-" + month + "-" + year + " " +
            hour + ":" + mins + ":" + secs + " " + msg;
        callback(str);
    }
}

function CoreDover_rc(code, loggercb) {
    CoreDover_log("Retrieving HTTP status for: " + code, loggercb);
    switch (code) {
        case 100:
            return 'Continue';
        case 101:
            return 'Switching Protocols';
        case 200:
            return 'OK';
        case 201:
            return 'Created';
        case 202:
            return 'Accepted';
        case 203:
            return 'Non-Authoritative Information';
        case 204:
            return 'No Content';
        case 205:
            return 'Reset Content';
        case 206:
            return 'Partial Content';
        case 300:
            return 'Multiple Choices';
        case 301:
            return 'Moved Permanently';
        case 302:
            return 'Moved Temporarily';
        case 303:
            return 'See Other';
        case 304:
            return 'Not Modified';
        case 305:
            return 'Use Proxy';
        case 400:
            return 'Bad Request';
        case 401:
            return 'Unauthorized';
        case 402:
            return 'Payment Required';
        case 403:
            return 'Forbidden';
        case 404:
            return 'Not Found';
        case 405:
            return 'Method Not Allowed';
        case 406:
            return 'Not Acceptable';
        case 407:
            return 'Proxy Authentication Required';
        case 408:
            return 'Request Time-out';
        case 409:
            return 'Conflict';
        case 410:
            return 'Gone';
        case 411:
            return 'Length Required';
        case 412:
            return 'Precondition Failed';
        case 413:
            return 'Request Entity Too Large';
        case 414:
            return 'Request-URI Too Large';
        case 415:
            return 'Unsupported Media Type';
        case 500:
            return 'Internal Server Error';
        case 501:
            return 'Not Implemented';
        case 502:
            return 'Bad Gateway';
        case 503:
            return 'Service Unavailable';
        case 504:
            return 'Gateway Time-out';
        case 505:
            return 'HTTP Version not supported';
        default:
            return 'Unknown';
    }
}

function CoreDover_ajax(url, responseType, loggercb, callback) {
    var uniqueID = '',
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charactersLength = characters.length;
    for (var i = 0; i < 20; i++) {
        uniqueID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (url.indexOf('?') > -1) {
        url += "&r=" + uniqueID;
    } else {
        url += "?r=" + uniqueID;
    }
    window.myXMLHttpRequest = false;
    CoreDover_log(
        "Creating XMLHttp request",
        function(str) {
            if (loggercb) loggercb(str);
            var XMLHttpFactories = [
                function() {
                    return new XMLHttpRequest();
                },
                function() {
                    return new ActiveXObject("Msxml3.XMLHTTP");
                },
                function() {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                },
                function() {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                },
                function() {
                    return new ActiveXObject("Msxml2.XMLHTTP");
                },
                function() {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
            ];
            for (var i = 0; i < XMLHttpFactories.length; i++) {
                try {
                    xmlhttp = XMLHttpFactories[i]();
                } catch (e) {
                    continue;
                }
                break;
            }
            window.myXMLHttpRequest = xmlhttp;
        }
    );
    if (!window.myXMLHttpRequest) {
        callback({
            success: false,
            details: "Ajax not supported",
            data: (responseType == "json") ? {} : ""
        });
        return;
    }
    window.myXMLHttpRequest.open('GET', url, true);
    window.myXMLHttpRequest.timeout = 5000;
    window.myXMLHttpRequest.ontimeout = function(e) {
        CoreDover_log("XMLHttp request timed out", loggercb);
    };
    window.myXMLHttpRequest.onreadystatechange = function() {
        if (this.readyState == 4) {
            CoreDover_log(
                "XMLHttp response received: Status " +
                this.status + " (" +
                CoreDover_rc(this.status) + ")",
                loggercb
            );
            if (this.status === 200) {
                CoreDover_log("XMLHttp request successful", loggercb);
                try {
                    callback({
                        success: true,
                        details: "Server response received",
                        data: (responseType == "json") ?
                            JSON.parse(this.responseText) :
                            this.responseText.toString()
                    });
                } catch (e) {
                    callback({
                        success: false,
                        details: "Ajax error: " + e,
                        data: (responseType == "json") ? {} : ""
                    });
                }
            } else {
                var e = "Server returned status: " + this.status;
                CoreDover_log(e, loggercb);
                callback({
                    success: false,
                    details: e,
                    data: (responseType == "json") ? {} : ""
                });
            }
        }
    };
    CoreDover_log(
        "Sending XMLHttp request",
        function(str) {
            if (loggercb) loggercb(str);
            try {
                window.myXMLHttpRequest.send();
                CoreDover_log("XMLHttp request sent", loggercb);
            } catch (e) {
                CoreDover_log("XMLHttp send error: " + e, loggercb);
            }
        }
    );
}

function CoreDover_spinner(action, loggercb) {
    if ("SpinnerDialog" in window) {
        CoreDover_log("Spinner plugin loaded", loggercb);
        switch (action) {
            case "start":
                CoreDover_log("Starting spinner", loggercb);
                SpinnerDialog.show(
                    "Loading ...",
                    "Please Wait",
                    true, {
                        overlayOpacity: 0.75
                    }
                );
                break;
            case "stop":
                CoreDover_log("Stopping spinner", loggercb);
                SpinnerDialog.hide();
                break;
            default:
                break;
        }
    } else {
        CoreDover_log("Spinner plugin missing", loggercb);
        switch (action) {
            case "start":
                CoreDover_log("Starting spinner", loggercb);
                var el = document.createElement("figure");
                el.id = "loading";
                $(el).css({
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "width": "100vw",
                    "height": "100vh",
                    "zIndex": "9999",
                    "paddingTop": "30px",
                    "font": "18px/24px arial",
                    "color": "rgb(100, 100, 100)",
                    "backgroundColor": "rgba(255, 255, 255, .85)"
                });
                el.innerHTML = "Loading ...<br><br>Please Wait";
                document.body.appendChild(el);
                break;
            case "stop":
                CoreDover_log("Stopping spinner", loggercb);
                document.body.removeChild(
                    document.getElementById("loading")
                );
                break;
            default:
                break;
        }
    }
}

function CoreDover_webview(url, target, loggercb, beforecb, startcb, stopcb, exitcb) {
    CoreDover_network(false, false, function(state) {
        if (state != "None") {
            CoreDover_log("Opening browser window: " + url, loggercb);
            var fallback = true;
            if ("cordova" in window) {
                if ("InAppBrowser" in window.cordova) {
                    CoreDover_log("InAppBrowser plugin found", false);
                    CoreDover_spinner("start");
                    var props = 'location=no,hidden=yes';
                    window.vars.myInAppBrowser = cordova.InAppBrowser.open(url, target, props);
                    if (stopcb) window.vars.cordovaInAppBrowserStop = stopcb;
                    window.vars.myInAppBrowser.addEventListener(
                        'loadstop',
                        function() {
                            CoreDover_log("Webview has loaded", loggercb);
                            CoreDover_spinner("stop");
                            window.vars.myInAppBrowser.show();
                            if ("cordovaInAppBrowserStop" in window.vars) {
                                window.vars.cordovaInAppBrowserStop();
                                delete window.vars.cordovaInAppBrowserStop;
                            }
                        }
                    );
                    window.vars.myInAppBrowser.addEventListener(
                        'loaderror',
                        function(params) {
                            CoreDover_log("Webview load error: " + params.message, loggercb);
                            CoreDover_spinner("stop");
                            window.vars.myInAppBrowser.close();
                            if ("cordovaInAppBrowserExit" in window.vars) {
                                delete window.vars.cordovaInAppBrowserExit;
                            }
                            delete window.vars.myInAppBrowser;
                            CoreDover_dialogue(
                                "alert",
                                "Error loading website",
                                params.message,
                                ["Dismiss"],
                                false
                            );
                        }
                    );
                    if (beforecb) window.vars.cordovaInAppBrowserBefore = beforecb;
                    window.vars.myInAppBrowser.addEventListener(
                        'beforeload',
                        function() {
                            CoreDover_log("Webview about to load", loggercb);
                            if ("cordovaInAppBrowserBefore" in window.vars) {
                                window.vars.cordovaInAppBrowserBefore();
                                delete window.vars.cordovaInAppBrowserBefore;
                            }
                        }
                    );
                    if (startcb) window.vars.cordovaInAppBrowserStart = startcb;
                    window.vars.myInAppBrowser.addEventListener(
                        'loadstart',
                        function() {
                            CoreDover_log("Webview load started", loggercb);
                            if ("cordovaInAppBrowserStart" in window.vars) {
                                window.vars.cordovaInAppBrowserStart();
                                delete window.vars.cordovaInAppBrowserStart;
                            }
                        }
                    );
                    if (exitcb) window.vars.cordovaInAppBrowserExit = exitcb;
                    window.vars.myInAppBrowser.addEventListener('exit', function() {
                        CoreDover_log("Webview window closed", loggercb);
                        if ("cordovaInAppBrowserExit" in window.vars) {
                            window.vars.cordovaInAppBrowserExit();
                            delete window.vars.cordovaInAppBrowserExit;
                        }
                        delete window.vars.myInAppBrowser;
                    });
                    fallback = false;
                }
            }
            if (fallback) {
                CoreDover_log("InAppBrowser plugin missing", loggercb);
                try {
                    window.open(url);
                    CoreDover_log("Webview opened", loggercb);
                } catch (e) {
                    CoreDover_log("Webview failed: " + e, loggercb);
                }
            }
        } else {
            CoreDover_log("Webview load error: No internet connection", loggercb);
            CoreDover_dialogue(
                "alert",
                "No internet connection",
                "Connection type was None",
                ["Dismiss"],
                false
            );
        }
    });
}

function CoreDover_network(offlinecb, onlinecb, callback, loggercb) {
    CoreDover_log("Checking network state", loggercb);
    if ("connection" in navigator) {
        CoreDover_log("Connection plugin found", false);
        if (offlinecb) document.addEventListener("offline", offlinecb, false);
        if (onlinecb) document.addEventListener("online", onlinecb, false);
        var networkState = navigator.connection.type,
            states = {};
        states[Connection.UNKNOWN] = 'Unknown';
        states[Connection.ETHERNET] = 'Ethernet';
        states[Connection.WIFI] = 'WiFi';
        states[Connection.CELL_2G] = '2G';
        states[Connection.CELL_3G] = '3G';
        states[Connection.CELL_4G] = '4G';
        states[Connection.CELL] = 'Cell';
        states[Connection.NONE] = 'None';
        CoreDover_log("Network state is " + states[networkState], loggercb);
        if (callback) callback(states[networkState]);
    } else {
        CoreDover_log("Connection plugin missing", loggercb);
        CoreDover_ajax(
            "https://coredover.com/ping.php",
            "string",
            false,
            function(data) {
                if (data.success) {
                    CoreDover_log("Network state is Unknown", loggercb);
                    if (callback) callback("Unknown");
                } else {
                    CoreDover_log("Network state is None", loggercb);
                    if (callback) callback("None");
                }
            }
        );
    }
}

function CoreDover_dialogue(type, title, msg, btns, callback, loggercb) {
    switch (type) {
        case 'alert':
            CoreDover_log("Sending alert: " + title + ", " + msg, loggercb);
            if ("notification" in navigator) {
                CoreDover_log("Dialogue plugin found", false);
                navigator.notification.alert(msg, callback, title, btns[0]);
            } else {
                CoreDover_log("Dialogue plugin missing", loggercb);
                alert(title + " " + msg);
                if (callback) callback();
            }
            break;
        case 'confirm':
            CoreDover_log("Sending confirm: " + title + ", " + msg, loggercb);
            if ("notification" in navigator) {
                CoreDover_log("Dialogue plugin found", false);
                navigator.notification.confirm(msg, callback, title, btns);
            } else {
                CoreDover_log("Dialogue plugin missing", loggercb);
                var r = confirm(title + " " + msg),
                    indx = r ? 0 : 1;
                if (callback) callback(indx);
            }
            break;
        case 'prompt':
            CoreDover_log("Sending prompt: " + title + ", " + msg, loggercb);
            if ("notification" in navigator) {
                CoreDover_log("Dialogue plugin found", loggercb);
                navigator.notification.prompt(msg, callback, title, btns, '');
            } else {
                CoreDover_log("Dialogue plugin missing", loggercb);
                var inp = prompt(title + " " + msg, '');
                if ((inp != null) && callback) {
                    callback({
                        buttonIndex: 0,
                        input1: inp
                    });
                }
            }
            break;
        default:
            CoreDover_log("Dialogue: invalid action", loggercb);
            break;
    }
}

function CoreDover_email(email_to, email_subject, loggercb) {
    CoreDover_log("Opening email client", loggercb);
    var fallback = true;
    if ("cordova" in window) {
        if ("plugins" in window.cordova) {
            if ("email" in window.cordova.plugins) {
                CoreDover_log("Email plugin found", loggercb);
                window.cordova.plugins.email.open({
                    to: email_to,
                    subject: email_subject
                });
                CoreDover_log("Email opened by plugin", loggercb);
                fallback = false;
            }
        }
    }
    if (fallback) {
        CoreDover_log("Email plugin missing", loggercb);
        window.location.href = "mailto:" + email_to + "?subject=" + email_subject;
        CoreDover_log("Email opened by browser", loggercb);
    }
}

function CoreDover_sqlite(dbName, tableName, action, createTable, data, callback, loggercb) {
    var db = false;
    if ("sqlitePlugin" in window) {
        CoreDover_log("SQLite plugin found", loggercb);
        if (!"dbEchoTest" in window) {
            CoreDover_log("Running SQLite echo test", loggercb);
            window.sqlitePlugin.echoTest(
                function() {
                    window.dbEchoTest = true;
                },
                function() {
                    window.dbEchoTest = false;
                }
            );
        }
        if (!"dbSelfTest" in window) {
            CoreDover_log("Running SQLite self test", loggercb);
            window.sqlitePlugin.selfTest(
                function() {
                    window.dbSelfTest = true;
                },
                function() {
                    window.dbSelfTest = false;
                }
            );
        }
        if (!window.dbEchoTest) {
            callback({
                success: false,
                details: "SQLite plugin failed echo test"
            });
            return;
        };
        if (!window.dbSelfTest) {
            callback({
                success: false,
                details: "SQLite plugin failed self test"
            });
            return;
        };
        CoreDover_log("SQLite plugin passed echo test", loggercb);
        CoreDover_log("SQLite plugin passed self test", loggercb);
        CoreDover_log("Opening database connection", loggercb);
        db = window.sqlitePlugin.openDatabase({
                name: dbName,
                location: 'default',
                createFromLocation: 1
            },
            function(_db) {},
            function(tx, err) {
                callback({
                    success: false,
                    details: "Database connection error: " +
                        ('message' in err) ? err.message : '' +
                        ('code' in err) ? ' (' + err.code + ')' : ''
                });
            }
        );
    } else if ("openDatabase" in window) {
        CoreDover_log("SQLite plugin missing", loggercb);
        CoreDover_log("Opening database connection", loggercb);
        try {
            db = window.openDatabase("mydb", "1.0", "My Database", 5000000);
        } catch (e) {
            callback({
                success: false,
                details: "Database connection error: " + e
            });
            return;
        }
    } else {
        CoreDover_log("SQLite not supported", loggercb);
        callback({
            success: false,
            details: "SQLite not supported"
        });
        return;
    }
    if (!db) {
        callback({
            success: false,
            details: "Database connection error",
        });
        return;
    }
    CoreDover_log("Database connection successful", loggercb);
    CoreDover_log("Opening database transaction", loggercb);
    db.transaction(function(tx) {
            if (action == "DROP") {
                CoreDover_log("Database query is DROP", loggercb);
                tx.executeSql(
                    "DROP TABLE IF EXISTS " + tableName + ";",
                    [],
                    function(tx, resultSet) {
                        CoreDover_log("Table successfully dropped", loggercb);
                        callback({
                            success: true,
                            details: "Table successfully dropped"
                        });
                    },
                    function(tx, err) {
                        var e = "Drop error: " +
                            ('message' in err) ? err.message : '' +
                            ('code' in err) ? ' (' + err.code + ')' : '';
                        CoreDover_log(e, loggercb);
                        callback({
                            success: false,
                            details: e
                        });
                    }
                );
            }
            if (createTable) {
                var c = [],
                    columns = [];
                for (var key in createTable) {
                    if (createTable.hasOwnProperty(key)) {
                        c.push("?");
                        columns.push(key + " " + createTable[key]);
                    }
                }
                CoreDover_log("Finding or creating table", loggercb);
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS " + tableName + " (" + c.join(",") + ");",
                    columns,
                    function(tx, resultSet) {
                        CoreDover_log("Table found or created", loggercb);
                    },
                    function(tx, err) {
                        var e = "Create error: " +
                            ('message' in err) ? err.message : '' +
                            ('code' in err) ? ' (' + err.code + ')' : '';
                        CoreDover_log(e, loggercb);
                        callback({
                            success: false,
                            details: e
                        });
                        window.dbfail = true;
                    }
                );
                if (("dbfail" in window) ? (window.dbfail) : false) return;
            }
            switch (action) {
                case "COUNT":
                    CoreDover_log("Database query is COUNT", loggercb);
                    tx.executeSql(
                        'SELECT count(*) AS mycount FROM ' + tableName + ";",
                        [],
                        function(tx, resultSet) {
                            CoreDover_log("Count is: " + resultSet.rows.item(0).mycount, loggercb);
                            callback({
                                success: true,
                                details: "Count successful",
                                data: parseInt(resultSet.rows.item(0).mycount)
                            });
                        },
                        function(tx, err) {
                            var e = "Count error :" +
                                ('message' in err) ? err.message : '' +
                                ('code' in err) ? ' (' + err.code + ')' : '';
                            CoreDover_log(e, loggercb);
                            callback({
                                success: false,
                                details: e
                            });
                        }
                    );
                    break;
                case "SELECT":
                    CoreDover_log("Database query is SELECT", loggercb);
                    if (!data) data = [{}];
                    var d;
                    for (d = 0; d < data.length; d++) {
                        var query = "SELECT * FROM " + tableName,
                            pos = 1
                        count = 0,
                            values = [];
                        for (var key in data[d]) {
                            if (data[d].hasOwnProperty(key)) ++count;
                        }
                        if (count > 0) {
                            query += " WHERE ";
                            for (var key in data[d]) {
                                if (data[d].hasOwnProperty(key)) {
                                    values.push(data[d][key]);
                                    query += key + " = '?'";
                                    if (pos < count) query += " AND ";
                                    ++pos;
                                }
                            }
                        }
                        query += ";";
                        tx.executeSql(
                            query,
                            values,
                            function(resultSet) {
                                if (resultSet.rows.length == 0) {
                                    CoreDover_log("No results found", loggercb);
                                    callback({
                                        success: true,
                                        details: "No results found",
                                        data: []
                                    });
                                    return;
                                }
                                var x, results = [];
                                for (x = 0; x < resultSet.rows.length; x++) {
                                    results.push(resultSet.rows.item(x));
                                }
                                CoreDover_log(resultSet.rows.length + " rows found", loggercb);
                                callback({
                                    success: true,
                                    details: "Select successful",
                                    data: results
                                });
                            },
                            function(tx, err) {
                                var e = "Select error: " +
                                    ('message' in err) ? err.message : '' +
                                    ('code' in err) ? ' (' + err.code + ')' : '';
                                CoreDover_log(e, loggercb);
                                callback({
                                    success: false,
                                    details: e
                                });
                            }
                        );
                    }
                    break;
                case "INSERT":
                    CoreDover_log("Database query is INSERT", loggercb);
                    if (!data) {
                        CoreDover_log("Nothing specified", loggercb);
                        callback({
                            success: false,
                            details: "Nothing specified"
                        });
                        return;
                    }
                    var d;
                    for (d = 0; d < data.length; d++) {
                        var c = [],
                            columns = [],
                            values = [];
                        for (var key in data[d]) {
                            if (data[d].hasOwnProperty(key)) {
                                c.push("?");
                                columns.push(key);
                                values.push(data[d][key]);
                            }
                        }
                        tx.executeSql(
                            "INSERT INTO " + tableName + "(" + columns.join(",") + ") VALUES (" + c.join(",") + ");",
                            values,
                            function(resultSet) {
                                CoreDover_log("Insert successful", loggercb);
                                callback({
                                    success: true,
                                    details: "Insert ID: " + resultSet.insertId +
                                        ", Rows affected: " + resultSet.rowsAffected
                                });
                            },
                            function(tx, err) {
                                var e = 'Insert error: ' +
                                    ('message' in err) ? err.message : '' +
                                    ('code' in err) ? ' (' + err.code + ')' : '';
                                CoreDover_log(e, loggercb);
                                callback({
                                    success: false,
                                    details: e
                                });
                            }
                        );
                    }
                    break;
                case "DELETE":
                    CoreDover_log("Database query is DELETE", loggercb);
                    if (!data) {
                        CoreDover_log("Nothing specified", loggercb);
                        callback({
                            success: false,
                            details: "Nothing specified"
                        });
                        return;
                    }
                    var d;
                    for (d = 0; d < data.length; d++) {
                        var query = "DELETE FROM " + tableName + " WHERE ",
                            pos = 1
                        count = 0;
                        for (var key in data[d]) {
                            if (data[d].hasOwnProperty(key)) ++count;
                        }
                        for (var key in data[d]) {
                            if (data[d].hasOwnProperty(key)) {
                                query += key + " = '" + data[d][key] + "'";
                                if (pos < count) query += " AND ";
                                ++pos;
                            }
                        }
                        query += ";";
                        tx.executeSql(
                            query,
                            [],
                            function(tx, resultSet) {
                                CoreDover_log("Delete successful", loggercb);
                                callback({
                                    success: true,
                                    details: "Delete successful"
                                });
                            },
                            function(tx, err) {
                                var e = "Delete error: " +
                                    ('message' in err) ? err.message : '' +
                                    ('code' in err) ? ' (' + err.code + ')' : '';
                                CoreDover_log(e, loggercb);
                                callback({
                                    success: false,
                                    details: e
                                });
                            }
                        );
                    }
                    break;
                default:
                    CoreDover_log("SQLite: invalid action", loggercb);
                    callback({
                        success: false,
                        details: "Invalid action"
                    });
                    break;
            }
        },
        function(err) {
            var e = "Transaction error: " +
                ('message' in err) ? err.message : '' +
                ('code' in err) ? ' (' + err.code + ')' : '';
            CoreDover_log(e, loggercb);
            callback({
                success: false,
                details: e
            });
        },
        function() {
            CoreDover_log("Transaction success", loggercb);
        });
}

function CoreDover_ns_codes(error) {
    var e = error.exception,
        s = error.source,
        c;
    switch (error.code) {
        case 1:
            c = "Native Write Failure";
        case 2:
            c = "Item Not Found";
        case 3:
            c = "Item Null Reference";
        case 4:
            c = "Item Undefined Type";
        case 5:
            c = "JSON Parse Error";
        case 6:
            c = "Item Wrong Parameter";
        default:
            c = "Unknown Error";
    }
    return c + (s ? ' (' + s + ')' : '') + (e ? ': ' + e : '')
}

function CoreDover_storage(action, key, val, callback, loggercb) {
    switch (action) {
        case "set":
            CoreDover_set(key, val, callback(result), loggercb);
            break;
        case "get":
            CoreDover_get(key, callback(result), loggercb);
            break;
        case "del":
            CoreDover_del(key, callback(result), loggercb);
            break;
        default:
            CoreDover_log("NativeStorage: invalid action", loggercb);
            break;
    }
}

function CoreDover_set(key, val, callback, loggercb) {
    CoreDover_log("Setting " + key, loggercb);
    if ("NativeStorage" in window) {
        CoreDover_log("NativeStorage plugin found", loggercb);
        window.vars.set = key;
        NativeStorage.setItem(
            key,
            val,
            function(obj) {
                CoreDover_log(
					"Setting " + window.vars.set + ": " + JSON.stringify(obj),
					loggercb
				);
                callback({
                    success: true,
                    details: "Set successful",
                    data: obj[window.vars.set]
                });
                delete window.vars.set;
            },
            function(error) {
                CoreDover_log(
					"Error setting " + window.vars.set + ": " + CoreDover_ns_codes(error),
					loggercb
				);
                callback({
                    success: false,
                    details: CoreDover_ns_codes(error)
                });
                delete window.vars.set;
            }
        );
    } else {
        CoreDover_log("NativeStorage plugin missing", loggercb);
        window.localStorage.setItem(key, val);
        return CoreDover_get(
			key,
			function(result) {
	            callback(result);
	        },
			loggercb
		);
    }
}

function CoreDover_get(key, callback, loggercb) {
    CoreDover_log("Getting " + key, loggercb);
    if ("NativeStorage" in window) {
        CoreDover_log("NativeStorage plugin found", loggercb);
        window.vars.get = key;
        NativeStorage.getItem(
            key,
            function(obj) {
                CoreDover_log(
					"Getting " + window.vars.get + ": " + JSON.stringify(obj),
					loggercb
				);
                callback({
                    success: true,
                    details: "Get successful",
                    data: obj[window.vars.get]
                });
                delete window.vars.get;
            },
            function(error) {
                CoreDover_log(
					"Error getting " + window.vars.get + ": " + CoreDover_ns_codes(error),
					loggercb
				);
                callback({
                    success: false,
                    details: CoreDover_ns_codes(error)
                });
                delete window.vars.get;
            }
        );
    } else {
        CoreDover_log("NativeStorage plugin missing", loggercb);
        var item = window.localStorage.getItem(key);
        return item ? callback({
            success: true,
            details: "Get successful",
            data: window.localStorage.getItem(key)
        }) : callback({
            success: false,
            details: "Get failed"
        });
    }
}

function CoreDover_del(key, callback, loggercb) {
    CoreDover_log("Deleting " + key, loggercb);
    if ("NativeStorage" in window) {
        CoreDover_log("NativeStorage plugin found", loggercb);
        window.vars.del = key;
        NativeStorage.remove(
            key,
            function(obj) {
                CoreDover_log(
					"Removing " + window.vars.del + ": " + JSON.stringify(obj),
					loggercb
				);
                callback({
                    success: true,
                    details: "Delete successful"
                });
                delete window.vars.del;
            },
            function(error) {
                CoreDover_log(
					"Error removing " + window.vars.del + ": " + CoreDover_ns_codes(error),
					loggercb
				);
                callback({
                    success: false,
                    details: CoreDover_ns_codes(error)
                });
                delete window.vars.del;
            }
        );
    } else {
        CoreDover_log("NativeStorage plugin missing", loggercb);
        window.localStorage.removeItem(key);
        return CoreDover_get(
			key,
			function(result) {
	            callback({
	                success: result.success ? false : true,
	                details: result.success ? "Delete failed" : "Delete success",
	            })
			},
			loggercb
        );
    }
}
