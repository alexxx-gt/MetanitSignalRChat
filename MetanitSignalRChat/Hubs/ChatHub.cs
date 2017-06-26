using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using MetanitSignalRChat.Models;
using Microsoft.AspNet.SignalR;

namespace MetanitSignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        static  List<User> Users = new List<User>();

        //Messages sending
        public void Send(string name, string message)
        {
            Clients.All.addMessage(name, message);
        }

        //New users connecting
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (!Users.Any(x => x.ConnectionId == id))
            {
                Users.Add(new User{ConnectionId = id, Name = userName});

                //Sending message to current user
                Clients.Caller.onConnected(id, userName, Users);

                //sending message to all users, excepting current
                Clients.AllExcept(id).onNewUserConnected(id, userName);
            }
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var item = Users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

            if (item != null)
            {
                Users.Remove(item);
                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item.Name);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}