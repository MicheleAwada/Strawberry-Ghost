from PIL import Image
import os
import io
from django.core.files import File
from django.utils import timezone
from django.db.models.fields.files import ImageFieldFile

base_image_operation = lambda image: image
base_name_operation = lambda name: (os.path.splitext(name)[0])
def editImage(field: ImageFieldFile, extra_operation: callable=base_image_operation, format: str="WEBP", name_operation: callable=base_name_operation, quality: int=90) -> bool:
    try:
        img = Image.open(field.open())
        img = extra_operation(img)

        fileName = os.path.basename(field.name)
        fileName = name_operation(fileName)
        fileName = fileName + "." + format.lower()

        image_io = io.BytesIO()
        img.save(image_io, format=format.upper(), quality=90)
        image_io.seek(0)

        content = File(image_io)

        field.delete(save=False)
        field.save(fileName, content)

        return True
    except:
        return False