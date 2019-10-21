import asyncio
import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async


class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print("conectado", event)

        await self.send(
            {
                "type":'websocket.accept'
            }
        )
        """ print(self.scope.keys())
        other_user=self.scope['url_route']['kwargs']
        me = self.scope['user']
        print(me, other_user)

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

            print(user)

            username = 'default'

            if user.is_authenticated:
                username=user.username

            myResponse = {
                'message': msg,
                'username': username
            }
            print(msg)

            await self.send(
                {
                    "type":'websocket.send',
                    "text": json.dumps(myResponse)
                    
                }
            )

    async def websocket_disconnect(self, event):
        print("desconectado", event)        