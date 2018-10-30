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

from keras.models import load_model
model = load_model('petplant_image.h5')



def main(filename = ""):
    test_datagen = ImageDataGenerator(rescale=1./255)

    test_generator = test_datagen.flow_from_directory(
            './images/'+ filename +'/upload',
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
        return "Sansevieria"
    else:
        print("This picture is spartyfilm")
        return "spartyfilm"

if __name__ == "__main__":
    import sys
    name = sys.argv[1]

    print(main(filename=name))