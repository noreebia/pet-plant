from keras.utils import np_utils
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Activation
import numpy as np
from numpy import argmax
import cv2
from keras.preprocessing.image import ImageDataGenerator

col_size = 56
row_size = 56


"""
cv_img = cv2.imread('test.jpg', cv2.IMREAD_GRAYSCALE)
blur = cv2.GaussianBlur(cv_img, (5, 5), 0)
ret, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

edge = cv2.Canny(binary, 127, 200)

(_, contours, _) = cv2.findContours(edge, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
mask = np.ones(cv_img.shape[:2], dtype="uint8") * 255

# Draw the contours on the mask
cv2.drawContours(mask, contours, -1, (0,255,0), 1)

import matplotlib.pyplot as plt
plt.imshow(edge)
plt.show()

cv2.imwrite("test_processed.jpg", edge)
"""

from keras.models import load_model
model = load_model('petplant_image.h5')

test_datagen = ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
        './data/test',
        target_size=(col_size, row_size),    
        batch_size=16,
        class_mode=None,
        shuffle=False)

# 6. 모델 사용하기
print("-- Predict --")
output = model.predict_generator(test_generator, steps=1)
np.set_printoptions(formatter={'float': lambda x: "{0:0.3f}".format(x)})
output = np.argmax(output,axis=-1)[0]
if output == 0:
    print("This picture is Sansevieria")
else:
    print("This picture is spartyfilm")