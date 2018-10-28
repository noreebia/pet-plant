from keras.utils import np_utils
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Activation
import numpy as np
from numpy import argmax
import cv2

col_size = 56
row_size = 56

from keras.models import load_model
model = load_model('petplant_image.h5')

cv_img = cv2.imread('test.jpg', cv2.IMREAD_GRAYSCALE)
blur = cv2.GaussianBlur(cv_img, (5, 5), 0)
ret, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

edge = cv2.Canny(binary, 50, 200)

(_, contours, _) = cv2.findContours(edge, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
mask = np.ones(cv_img.shape[:2], dtype="uint8") * 255

# Draw the contours on the mask
cv2.drawContours(mask, contours, -1, (0,255,0), 1)
cv2.imwrite("test.jpg", mask)

im = cv2.resize(cv2.imread('test.jpg'), (col_size, row_size)).astype(np.float32)
im[:,:,0] -= 103.939
im[:,:,1] -= 116.779
im[:,:,2] -= 123.68
im = np.expand_dims(im, axis=0)


out = model.predict_classes(im)
print(out)