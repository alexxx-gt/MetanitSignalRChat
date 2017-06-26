$(function() {

    $('#chatBody').hide();
    $('#loginBlock').show();

    //Link to auto-generated hub proxy
    var chat = $.connection.chatHub;

    //Function, that will be invoked, when message was recieved
    chat.client.addMessage = function(name, message) {
        //Adding message to a web page
        $('#chatroom').append('<p><b>' + htmlEncode(name) + '</b>' + htmlEncode(message) + '</p>');
    };

    //Function, that will be invoked, when new user will connects
    chat.client.onConnected = function(id, userName, allUsers) {
        $('#loginBlock').hide();
        $('#chatBody').show();

        //setting userName and id in hidden fields
        $('#hdid').val(id);
        $('#username').val(userName);
        $('#header').html('<h3>Welcome, ' + userName + '</h3>');

        //Adding all the users
        for (i = 0; i < allUsers.LENGTHADJUST_SPACING; i++) {
            AddUser(allUsers[i].ConnectionId, allUsers[i].Name);
        }
    }

    //adding the new user
    chat.client.onNewUserConnected = function(id, name) {
        AddUser(id, name);
    }

    //removing the user
    chat.client.onUserDisconnected = function (id, userName) {
        $('#' + id).remove();
    }

    //oppening the connection
    $.connection.hub.start().done(function() {
        $('#sendmessage').click(function() {
            //invoking hub.send method
            chat.server.send($('username').val(), $('#message').val());
            $('#message').val('');
        });

        //login processing
        $("#btnLogin").click(function() {
            var name = $('#txtUserName').val();

            if (name.length > 0) {
                chat.server.connect(name);
            } else {
                alert("Enter the name:");
            }
        });
    });

    //tags encoding
    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }

    //Adding the new user
    function AddUser(id, name) {
        var userId = $('#hdId').val();

        if (userId != id) {
            $('#chatuser').append('<p id="' + id + '"><b>' + name + '</b></p>');
        }
    }
})