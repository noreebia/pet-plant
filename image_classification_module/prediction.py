from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
import numpy as np
import cv2

model = VGG16(weights='imagenet')
model.summary()

im = cv2.resize(cv2.imread('C:/Project/my-pet-plant/image_classification_module/data/validation/spartyfilm/600(2).jpg'), (224, 224)).astype(np.float32)
im[:,:,0] -= 103.939
im[:,:,1] -= 116.779
im[:,:,2] -= 123.68
im = np.expand_dims(im, axis=0)


out = model.predict(im)
print(np.argmax(out))