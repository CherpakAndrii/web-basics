import asyncio
import datetime

from pyrogram import Client
from pyrogram.types import Message, User
from pyrogram.enums import ChatType

#app = Client("my_account")

async def main():
    async with Client("my_account") as app:
        usr = await app.get_users("")
        print(usr)

# @app.on_message()
# async def my_handler(client: Client, msg: Message):
#     if msg.chat.type == ChatType.PRIVATE:
#         print(f'{msg.from_user.first_name} {msg.from_user.last_name}: "{msg.text if msg.text is not None else msg.caption if msg.caption is not None else ""}" ({msg.date})')
#         #print(msg)
#         #member = await app.get_users("+380950709410")
#         #print(member)
#         #await msg.forward("me")


asyncio.run(main())
