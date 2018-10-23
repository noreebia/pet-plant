from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
from keras.layers import Input, Flatten, Dense
from keras.models import Model
from keras.optimizers import SGD
import numpy as np
from keras.preprocessing.image import ImageDataGenerator
import keras.backend.tensorflow_backend as K

# 상수 정의
col_size = 224
row_size = 224
output = 3

# 랜덤시드 고정시키기
np.random.seed(3)

# 데이터셋 불러오기
train_datagen = ImageDataGenerator(rescale=1./255, 
                                   rotation_range=10,
                                   width_shift_range=0.2,
                                   height_shift_range=0.2,
                                   shear_range=0.7,
                                   zoom_range=[0.9, 2.2],
                                   horizontal_flip=True,
                                   vertical_flip=True,
                                   fill_mode='nearest')

train_generator = train_datagen.flow_from_directory(
        'C://Project/my-pet-plant/image_classification_module/data/train',
        target_size=(col_size, row_size),
        batch_size=10,
        class_mode='categorical')

test_datagen = ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
        'C://Project/my-pet-plant/image_classification_module/data/test',
        target_size=(col_size, row_size),    
        batch_size=10,
        class_mode='categorical')


# 2. 모델 구성하기
with K.tf.device('/gpu:0'):
    # VGG16 모델 불러오기
    vgg16 = VGG16(weights=None, include_top=True)

    # OUTPUT의 갯수를 변경
    x = Dense(output, activation='softmax', name='predictions')(vgg16.layers[-2].output)

    # 새롭게 정의된 PetPlant용 모델 
    my_model = Model(input=vgg16.input, output=x)

    # 모델 확인
    my_model.summary()

    # 3. 모델 학습과정 설정하기
    my_model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

    # 4. 모델 학습시키기
    from keras.callbacks import EarlyStopping
    early_stopping = EarlyStopping() # 조기종료 콜백함수 정의

    hist = my_model.fit_generator(
            train_generator,
            steps_per_epoch=15,
            epochs=50,
            validation_data=test_generator,
            validation_steps=5,
            callbacks=[early_stopping])

# 5. 모델 평가하기
print("-- Evaluate --")
scores = my_model.evaluate_generator(test_generator, steps=5)
print("%s: %.2f%%" %(my_model.metrics_names[1], scores[1]*100))

# 6. 모델 사용하기
print("-- Predict --")
output = my_model.predict_generator(test_generator, steps=5)
np.set_printoptions(formatter={'float': lambda x: "{0:0.3f}".format(x)})
print(test_generator.class_indices)
print(output)

# 표시
import matplotlib.pyplot as plt

fig, loss_ax = plt.subplots()

acc_ax = loss_ax.twinx()

loss_ax.plot(hist.history['loss'], 'y', label='train loss')
loss_ax.plot(hist.history['val_loss'], 'r', label='val loss')

acc_ax.plot(hist.history['acc'], 'b', label='train acc')
acc_ax.plot(hist.history['val_acc'], 'g', label='val acc')

loss_ax.set_xlabel('epoch')
loss_ax.set_ylabel('loss')
acc_ax.set_ylabel('accuray')

loss_ax.legend(loc='upper left')
acc_ax.legend(loc='lower left')

plt.show()