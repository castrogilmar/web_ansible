import asyncio
import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from .ansible_get_tasks import GetTasks
from .ansible_exec_tasks import ExecTasks

class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print("conectado", event)


        self.group_name = "{}".format(1)
        # Join room group

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.send(
            {
                "type":'websocket.accept'
            }
        )

        """ other_user=self.scope['url_route']['kwargs']['username']
        me = self.scope['user']
        print(me, other_user) """
        

        #thread_obj = await self.get_thread(me, other_user)

        #print(thread_obj)
        """ print(self.scope.keys())
        other_user=self.scope['url_route']['kwargs']
        

        await self.send(
            {
                "type":'websocket.send',
                "text":"Ola!!!!!!"
            }
        ) """

    async def websocket_receive(self, event):
        print("recendo", event)

        front_text = event.get('text', None)

        if front_text is not None:
            loaded_dict_data = json.loads(front_text)

            msg = loaded_dict_data.get('message')
            user = self.scope['user']
            request=""
            id_task=""

            if msg == "get_tasks":
                obj_tasks=GetTasks()
                #print(obj_tasks)
                msg=obj_tasks.get_taks()
                request="get_tasks"

            if msg == "exec_tasks":
                obj_tasks=ExecTasks()

                taks = loaded_dict_data.get('task') 
                id_task = loaded_dict_data.get('id_task')               
                msg=obj_tasks.exec_task(taks)      
                request="exec_tasks"            

                #print(msg) 

            print(user)

            username = 'default'

            if user.is_authenticated:
                username=user.username

            myResponse = {
                'message': msg,
                'request': request,
                'username': username,
                'id_task': id_task
            }
            #print(msg)

            new_event={
                    "type":'websocket.send',
                    "text": json.dumps(myResponse)
                    
                }

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat_message",
                    "text": json.dumps(myResponse)
                }

            )    

            """ await self.send(
                {
                    "type":'websocket.send',
                    "text": json.dumps(myResponse)
                    
                }
            ) """
    async def chat_message(self, event):
        print("message", event)



        await self.send(
                {
                    "type":'websocket.send',
                    "text": event['text']
                    
                }
            )

    async def websocket_disconnect(self, event):
        print("desconectado", event) 

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )   

    @database_sync_to_async
    def get_thread(self, user, other_username):
        return Thread.objects.get_or_new(user, other_username)[0]         