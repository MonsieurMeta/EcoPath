import asyncio
import base64
import requests
 

#url='https://www.umweltbundesamt.de/sites/default/files/medien/479/bilder/gettyimages-693300197_peter_dazeley.jpg'


# OpenAI API Key
api_key = "sk-BVwwyOCYSBJQhmyAYM_gVQdScYszYMNZqtQEY5v5hFT3BlbkFJEGCb7jD8m0uqqhfc5JYlLQwOa-qbjUpVPExSahJsAA"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}
#Function to encode the image
async def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')
    

async def describe_base64_picture(uid:int,base64_image:str,funct:str):

    
  
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": "list all the items you see in the picture. Output in a list only with the ALL the items names, and materials. Do not describe surroundings/environment.",
            },
            {
                "type": "image_url",
                "image_url": {
                "url": f"{base64_image}"
                }
            }
            ]
        }
        ],
        "max_tokens": 500
    }
    response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    result=response.json()["choices"][0]["message"]["content"]
    #async def rate_trash(materials: str, trash_type: str):
    if funct=="rate":
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
            {
                "role": "user",
                "content": [
                {
                    "type": "text",
                    "text": f"I have a picture of a trash can. This is the trash inside: {result}. Please rate the trash can on a scale of 1-10, based on how sorted it is. For example, if the content of the trash is mixed with all categories of trash(recycle, general waste, compost, and hazardous), then it would get a low mark. If the contents are relatively in the same category, then it would get a higher mark. After you rate it, explain why and how to improve in one or two SHORT sentences.",
                },
        
                ]
            }
            ],
            "max_tokens": 500
        }
        response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        result=response.json()["choices"][0]["message"]["content"]
        return result
    
    elif funct=="sort_item":
        payload = {
        "model": "gpt-4o-mini",
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": f"Tell me which bin should put this piece of trash in: {result}(recycle, general waste, compost, and hazardous), make it a bit shorter, but still have consise explanations",
            },
    
            ]
        }
        ],
        "max_tokens": 500
        }
        response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        result=response.json()["choices"][0]["message"]["content"]

        return result


async def describe_picture(funct: str, user_image:bytes):

    base64_image = base64.b64encode(user_image).decode('utf-8')  
  
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": "list all the items you see in the picture. Output in a list only with the ALL the items names, and materials. Do not describe surroundings/environment.",
            },
            {
                "type": "image_url",
                "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
                }
            }
            ]
        }
        ],
        "max_tokens": 500
    }
    response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    result=response.json()["choices"][0]["message"]["content"]
    #async def rate_trash(materials: str, trash_type: str):
    if funct=="rate":
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
            {
                "role": "user",
                "content": [
                {
                    "type": "text",
                    "text": f"I have a picture of a trash can. This is the trash inside: {result}. Please rate the trash can on a scale of 1-10, based on how sorted it is. For example, if the content of the trash is mixed with all categories of trash(recycle, general waste, compost, and hazardous), then it would get a low mark. If the contents are relatively in the same category, then it would get a higher mark. After you rate it, explain why and how to improve in one or two SHORT sentences.",
                },
        
                ]
            }
            ],
            "max_tokens": 500
        }
        response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        result=response.json()["choices"][0]["message"]["content"]
        return result
    
    elif funct=="sort_item":
        payload = {
        "model": "gpt-4o-mini",
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": f"Tell me which bin should put this piece of trash in: {result}(recycle, general waste, compost, and hazardous), make it a bit shorter, but still have consise explanations",
            },
    
            ]
        }
        ],
        "max_tokens": 500
        }
        response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        result=response.json()["choices"][0]["message"]["content"]

        return result




'''   
    elif funct=="sort_bin":
        payload = {
        "model": "gpt-4o-mini",
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": f"Tell me which bin should put each piece of trash in this picture: {result}say into these bins:(recycle bin, general waste bin, compost bin, hazardous bin)
    
            ]
        }
        ],
        "max_tokens": 500
        }
        response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        result=response.json()["choices"][0]["message"]["content"]
        return result    
    #return result
'''
'''
txt=f'We have the following items\n\n: {result}\n\nAre those items are properly put recycle bin? if not help me sorted and put correct recycle bin. '
payload = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
         "content": [
          {
            "type": "text",
            "text": f"{txt}",
          },
 
        ]
      }
    ],
    "max_tokens": 500
}
response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

result=response.json()["choices"][0]["message"]["content"]

print(result)
'''

async def rate_trash(materials: str, trash_type: str):

    payload = {
        "model": "gpt-4o-mini",
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": f"I have a picture of a trash can. That is for {trash_type}. There are these materials inside: {materials}. Please rate the trash can on a scale of 1-10, and explain why and how to improve in two SHORT sentences.",
            },
    
            ]
        }
        ],
        "max_tokens": 500
    }
    response=requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    result=response.json()["choices"][0]["message"]["content"]

		

'''
if __name__ == "__main__":
   #result=  asyncio.run(    describe_picture("/home/bking/Desktop/vshacks/trash1.png"))
   #result=  asyncio.run(    encode_image("/home/bking/Desktop/vshacks/trash1.png"))

   print(result)
'''